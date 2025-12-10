use std::process::{Command, Child};
use std::sync::Mutex;
use tauri::{Emitter, Manager};
use tauri::path::BaseDirectory;
use serde::Serialize;

#[derive(Clone, Serialize)]
struct LogMessage {
    level: String,
    message: String,
    timestamp: String,
}

/// Helper function to log messages both to console and frontend
fn log_to_frontend(app: &tauri::AppHandle, level: &str, message: String) {
    // Print to console
    println!("{}", message);
    
    // Send to frontend
    let timestamp = chrono::Local::now().format("%H:%M:%S%.3f").to_string();
    let log_msg = LogMessage {
        level: level.to_string(),
        message: message.clone(),
        timestamp,
    };
    
    let _ = app.emit("plantuml-log", log_msg);
}

// Global state to hold the PlantUML server process and reference count
static PLANTUML_SERVER: Mutex<Option<Child>> = Mutex::new(None);
// Track how many instances are using the server
static SERVER_REFERENCE_COUNT: Mutex<usize> = Mutex::new(0);

#[tauri::command]
pub async fn start_plantuml_server(app: tauri::AppHandle) -> Result<String, String> {
    log_to_frontend(&app, "info", "[PlantUML] start_plantuml_server command called".to_string());
    
    // Check if server is already running in this process
    {
        let mut server = PLANTUML_SERVER.lock().unwrap();
        if let Some(ref mut child) = *server {
            // Check if process is still alive
            if child.try_wait().map_err(|e| e.to_string())?.is_none() {
                log_to_frontend(&app, "info", "[PlantUML] Server already running in this process".to_string());
                // Increment reference count
                let mut ref_count = SERVER_REFERENCE_COUNT.lock().unwrap();
                *ref_count += 1;
                log_to_frontend(&app, "info", format!("[PlantUML] Reference count incremented to: {}", *ref_count));
                return Ok("PlantUML server is already running on http://localhost:8080".to_string());
            }
        }
    }

    // Check if port 8080 is already in use (another instance might be running the server)
    log_to_frontend(&app, "info", "[PlantUML] Checking if port 8080 is available...".to_string());
    match check_port_available(8080) {
        Ok(false) => {
            // Port is already in use, likely another instance is running the server
            log_to_frontend(&app, "info", "[PlantUML] Port 8080 is already in use (another instance is running the server)".to_string());
            log_to_frontend(&app, "info", "[PlantUML] Using existing PlantUML server on http://localhost:8080".to_string());
            // Increment reference count for shared server
            let mut ref_count = SERVER_REFERENCE_COUNT.lock().unwrap();
            *ref_count += 1;
            log_to_frontend(&app, "info", format!("[PlantUML] Reference count incremented to: {}", *ref_count));
            return Ok("Using existing PlantUML server on http://localhost:8080 (shared with another instance)".to_string());
        }
        Err(e) => {
            log_to_frontend(&app, "warn", format!("[PlantUML] Warning: Could not check port availability: {}", e));
            // Continue anyway, we'll handle the error when starting the server
        }
        Ok(true) => {
            log_to_frontend(&app, "info", "[PlantUML] Port 8080 is available".to_string());
        }
    }

    log_to_frontend(&app, "info", "[PlantUML] Resolving PlantUML jar path...".to_string());
    // Get the PlantUML jar path
    let plantuml_jar_path = app.path()
        .resolve("plantuml-portable/bin/plantuml-1.2025.10.jar", BaseDirectory::Resource)
        .map_err(|e| {
            let error_msg = format!("Failed to resolve PlantUML jar path: {}", e);
            log_to_frontend(&app, "error", format!("[PlantUML] ERROR: {}", error_msg));
            error_msg
        })?;

    log_to_frontend(&app, "info", format!("[PlantUML] PlantUML jar path: {:?}", plantuml_jar_path));

    if !plantuml_jar_path.exists() {
        let error_msg = format!("PlantUML jar not found at: {:?}", plantuml_jar_path);
        log_to_frontend(&app, "error", format!("[PlantUML] ERROR: {}", error_msg));
        return Err(error_msg);
    }

    log_to_frontend(&app, "info", "[PlantUML] PlantUML jar exists, preparing to start server".to_string());

    // Use system Java for all platforms (picoweb mode doesn't need bundled JRE)
    let java_cmd = "java";
    log_to_frontend(&app, "info", format!("[PlantUML] Using Java command: {}", java_cmd));

    // Start the PlantUML server
    log_to_frontend(&app, "info", format!("[PlantUML] Executing: {} -jar {:?} -picoweb", java_cmd, plantuml_jar_path));
    let child = Command::new(java_cmd)
        .arg("-jar")
        .arg(&plantuml_jar_path)
        .arg("-picoweb")
        .spawn()
        .map_err(|e| {
            let error_msg = format!("Failed to start PlantUML server: {}", e);
            log_to_frontend(&app, "error", format!("[PlantUML] ERROR: {}", error_msg));
            error_msg
        })?;

    log_to_frontend(&app, "info", "[PlantUML] Server process spawned successfully".to_string());

    // Store the process and increment reference count
    {
        let mut server = PLANTUML_SERVER.lock().unwrap();
        *server = Some(child);
        
        let mut ref_count = SERVER_REFERENCE_COUNT.lock().unwrap();
        *ref_count = 1; // First instance to start the server
        log_to_frontend(&app, "info", format!("[PlantUML] Reference count set to: {}", *ref_count));
    }

    let success_msg = "PlantUML server started on http://localhost:8080".to_string();
    log_to_frontend(&app, "info", success_msg.clone());
    Ok(success_msg)
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
/// Uses reference counting - only stops the server when the last instance closes
pub async fn cleanup_plantuml_server() -> Result<(), String> {
    // Decrement reference count
    let should_stop = {
        let mut ref_count = SERVER_REFERENCE_COUNT.lock().unwrap();
        if *ref_count > 0 {
            *ref_count -= 1;
            println!("[PlantUML] Reference count decremented to: {}", *ref_count);
        }
        *ref_count == 0
    };
    
    // Only stop the server if reference count reached 0
    if should_stop {
        let mut server = PLANTUML_SERVER.lock().unwrap();
        if let Some(mut child) = server.take() {
            println!("[PlantUML] Last instance closing - stopping PlantUML server");
            child.kill().map_err(|e| format!("Failed to stop PlantUML server: {}", e))?;
            println!("[PlantUML] Server stopped during cleanup");
        }
    } else {
        println!("[PlantUML] Other instances still using server - keeping it alive");
    }
    
    Ok(())
}

/// Helper function to check if a port is available
fn check_port_available(port: u16) -> Result<bool, String> {
    use std::net::TcpListener;
    
    match TcpListener::bind(("127.0.0.1", port)) {
        Ok(_) => Ok(true),  // Port is available
        Err(e) => {
            if e.kind() == std::io::ErrorKind::AddrInUse {
                Ok(false)  // Port is in use
            } else {
                Err(format!("Error checking port: {}", e))
            }
        }
    }
}
