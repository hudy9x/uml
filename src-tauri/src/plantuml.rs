use std::process::Command;
use std::path::PathBuf;
use std::fs;
use tauri::Manager;

#[derive(Debug, serde::Serialize)]
pub struct DiagramOutput {
    pub content: String,
    pub format: String,
}

#[tauri::command]
pub async fn generate_diagram(
    app: tauri::AppHandle,
    file_path: String,
    format: Option<String>,
) -> Result<DiagramOutput, String> {
    let format = format.unwrap_or_else(|| "svg".to_string());
    
    // Validate format
    if format != "svg" && format != "png" {
        return Err("Format must be either 'svg' or 'png'".to_string());
    }

    #[cfg(target_os = "windows")]
    {
        generate_diagram_windows(app, file_path, format).await
    }

    #[cfg(not(target_os = "windows"))]
    {
        generate_diagram_unix(app, file_path, format).await
    }
}

// Helper function to find plantuml directory
fn get_plantuml_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    // Try resource directory first (production build)
    if let Ok(resource_path) = app.path().resource_dir() {
        let plantuml_dir = resource_path.join("plantuml-portable").join("bin");
        let plantuml_jar = plantuml_dir.join("plantuml-1.2025.10.jar");
        if plantuml_jar.exists() {
            return Ok(plantuml_dir);
        }
    }
    
    // Fallback to development path
    // In development, the executable is in target/debug, so we go up to src-tauri
    let exe_path = std::env::current_exe()
        .map_err(|e| format!("Failed to get current exe path: {}", e))?;
    
    // Navigate from target/debug to src-tauri
    let src_tauri = exe_path
        .parent() // target/debug
        .and_then(|p| p.parent()) // target
        .and_then(|p| p.parent()) // src-tauri
        .ok_or("Failed to navigate to src-tauri directory")?;
    
    let plantuml_dir = src_tauri.join("plantuml-portable").join("bin");
    let plantuml_jar = plantuml_dir.join("plantuml-1.2025.10.jar");
    
    if plantuml_jar.exists() {
        Ok(plantuml_dir)
    } else {
        Err(format!("PlantUML jar not found at: {:?}", plantuml_jar))
    }
}

// Windows implementation
#[cfg(target_os = "windows")]
async fn generate_diagram_windows(
    app: tauri::AppHandle,
    file_path: String,
    format: String,
) -> Result<DiagramOutput, String> {
    let plantuml_dir = get_plantuml_dir(&app)?;
    let plantuml_jar = plantuml_dir.join("plantuml-1.2025.10.jar");

    // Create a temporary output directory
    let temp_dir = std::env::temp_dir().join("plantuml_output");
    fs::create_dir_all(&temp_dir)
        .map_err(|e| format!("Failed to create temp directory: {}", e))?;

    // Use bundled JRE on Windows
    let jre_path = plantuml_dir.join("jre").join("bin").join("java.exe");
    let java_cmd = if jre_path.exists() {
        jre_path.to_string_lossy().to_string()
    } else {
        return Err("Bundled JRE not found. Please ensure PlantUML-Portable is properly installed.".to_string());
    };

    // Build the command
    let mut cmd = Command::new(&java_cmd);
    
    // Add Graphviz support for Windows
    let graphviz_dot = plantuml_dir.join("graphviz").join("bin").join("dot.exe");
    if graphviz_dot.exists() {
        cmd.arg(format!("-DGRAPHVIZ_DOT={}", graphviz_dot.to_string_lossy()));
    }

    // Add PlantUML arguments
    cmd.arg("-jar")
        .arg(&plantuml_jar)
        .arg(format!("-t{}", format))
        .arg("-o")
        .arg(&temp_dir)
        .arg(&file_path);

    // Execute the command
    let output = cmd.output()
        .map_err(|e| format!("Failed to execute PlantUML: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("PlantUML execution failed: {}", stderr));
    }

    // Read the generated file
    read_diagram_output(&file_path, &temp_dir, &format)
}

// macOS/Linux implementation
#[cfg(not(target_os = "windows"))]
async fn generate_diagram_unix(
    app: tauri::AppHandle,
    file_path: String,
    format: String,
) -> Result<DiagramOutput, String> {
    let plantuml_dir = get_plantuml_dir(&app)?;
    let plantuml_jar = plantuml_dir.join("plantuml-1.2025.10.jar");

    // Create a temporary output directory
    let temp_dir = std::env::temp_dir().join("plantuml_output");
    fs::create_dir_all(&temp_dir)
        .map_err(|e| format!("Failed to create temp directory: {}", e))?;

    // Use system Java on macOS/Linux
    let java_cmd = "java";

    // Build the command
    let mut cmd = Command::new(java_cmd);
    
    // Add PlantUML arguments (Graphviz will be auto-detected via PATH on Unix systems)
    cmd.arg("-jar")
        .arg(&plantuml_jar)
        .arg(format!("-t{}", format))
        .arg("-o")
        .arg(&temp_dir)
        .arg(&file_path);

    // Execute the command
    let output = cmd.output()
        .map_err(|e| format!("Failed to execute PlantUML. Make sure Java is installed: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("PlantUML execution failed: {}", stderr));
    }

    // Read the generated file
    read_diagram_output(&file_path, &temp_dir, &format)
}

// Common function to read diagram output
fn read_diagram_output(
    file_path: &str,
    temp_dir: &PathBuf,
    format: &str,
) -> Result<DiagramOutput, String> {
    let input_path = PathBuf::from(file_path);
    let file_stem = input_path.file_stem()
        .ok_or("Invalid file path")?
        .to_string_lossy();
    
    let output_file = temp_dir.join(format!("{}.{}", file_stem, format));
    
    if !output_file.exists() {
        return Err(format!("Output file not found: {:?}", output_file));
    }

    let content = if format == "svg" {
        fs::read_to_string(&output_file)
            .map_err(|e| format!("Failed to read SVG file: {}", e))?
    } else {
        // For PNG, read as base64
        let bytes = fs::read(&output_file)
            .map_err(|e| format!("Failed to read PNG file: {}", e))?;
        format!("data:image/png;base64,{}", base64::encode(&bytes))
    };

    // Clean up the temporary file
    let _ = fs::remove_file(&output_file);

    Ok(DiagramOutput {
        content,
        format: format.to_string(),
    })
}

// Base64 encoding for PNG support
mod base64 {
    pub fn encode(data: &[u8]) -> String {
        use std::fmt::Write;
        const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        let mut result = String::new();
        let mut i = 0;
        
        while i < data.len() {
            let b1 = data[i];
            let b2 = if i + 1 < data.len() { data[i + 1] } else { 0 };
            let b3 = if i + 2 < data.len() { data[i + 2] } else { 0 };
            
            let _ = write!(result, "{}", CHARS[(b1 >> 2) as usize] as char);
            let _ = write!(result, "{}", CHARS[(((b1 & 0x03) << 4) | (b2 >> 4)) as usize] as char);
            
            if i + 1 < data.len() {
                let _ = write!(result, "{}", CHARS[(((b2 & 0x0F) << 2) | (b3 >> 6)) as usize] as char);
            } else {
                result.push('=');
            }
            
            if i + 2 < data.len() {
                let _ = write!(result, "{}", CHARS[(b3 & 0x3F) as usize] as char);
            } else {
                result.push('=');
            }
            
            i += 3;
        }
        
        result
    }
}
