use std::process::{Command, Child};
use std::sync::Mutex;
use tauri::Manager;
use tauri::path::BaseDirectory;

// Global state to hold the PlantUML server process
static PLANTUML_SERVER: Mutex<Option<Child>> = Mutex::new(None);

#[tauri::command]
pub async fn start_plantuml_server(app: tauri::AppHandle) -> Result<String, String> {
    // Check if server is already running
    {
        let mut server = PLANTUML_SERVER.lock().unwrap();
        if let Some(ref mut child) = *server {
            // Check if process is still alive
            if child.try_wait().map_err(|e| e.to_string())?.is_none() {
                return Ok("PlantUML server is already running on http://localhost:8080".to_string());
            }
        }
    }

    // Get the PlantUML jar path
    let plantuml_jar_path = app.path()
        .resolve("plantuml-portable/bin/plantuml-1.2025.10.jar", BaseDirectory::Resource)
        .map_err(|e| format!("Failed to resolve PlantUML jar path: {}", e))?;

    if !plantuml_jar_path.exists() {
        return Err(format!("PlantUML jar not found at: {:?}", plantuml_jar_path));
    }

    // Use system Java for all platforms (picoweb mode doesn't need bundled JRE)
    let java_cmd = "java";

    // Start the PlantUML server
    let child = Command::new(java_cmd)
        .arg("-jar")
        .arg(&plantuml_jar_path)
        .arg("-picoweb")
        .spawn()
        .map_err(|e| format!("Failed to start PlantUML server: {}", e))?;

    // Store the process
    {
        let mut server = PLANTUML_SERVER.lock().unwrap();
        *server = Some(child);
    }

    Ok("PlantUML server started on http://localhost:8080".to_string())
}

#[tauri::command]
pub async fn stop_plantuml_server() -> Result<String, String> {
    let mut server = PLANTUML_SERVER.lock().unwrap();
    
    if let Some(mut child) = server.take() {
        child.kill().map_err(|e| format!("Failed to stop PlantUML server: {}", e))?;
        Ok("PlantUML server stopped".to_string())
    } else {
        Ok("PlantUML server is not running".to_string())
    }
}

#[tauri::command]
pub async fn check_plantuml_server() -> Result<bool, String> {
    let mut server = PLANTUML_SERVER.lock().unwrap();
    
    if let Some(ref mut child) = *server {
        // Check if process is still alive
        match child.try_wait() {
            Ok(Some(_)) => {
                // Process has exited
                *server = None;
                Ok(false)
            }
            Ok(None) => {
                // Process is still running
                Ok(true)
            }
            Err(e) => Err(format!("Failed to check server status: {}", e))
        }
    } else {
        Ok(false)
    }
}

/// Cleanup function to stop the PlantUML server (used during app shutdown)
pub async fn cleanup_plantuml_server() -> Result<(), String> {
    let mut server = PLANTUML_SERVER.lock().unwrap();
    
    if let Some(mut child) = server.take() {
        child.kill().map_err(|e| format!("Failed to stop PlantUML server: {}", e))?;
        println!("PlantUML server stopped during cleanup");
    }
    Ok(())
}
