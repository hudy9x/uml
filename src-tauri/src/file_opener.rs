use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager};

/// Global state to store the opened file path
pub struct OpenedFilePath(pub Mutex<Option<String>>);

/// Command to retrieve the opened file path from state
#[tauri::command]
pub fn get_opened_file_path(state: tauri::State<OpenedFilePath>) -> Option<String> {
    state.0.lock().unwrap().clone()
}

/// Check if a file path has a supported extension
fn is_supported_file(file_path: &str) -> bool {
    file_path.ends_with(".pu")
        || file_path.ends_with(".puml")
        || file_path.ends_with(".mmd")
        || file_path.ends_with(".mermaid")
}

/// Windows-specific: Setup file opening via CLI arguments
#[cfg(target_os = "windows")]
pub fn setup_windows_file_opener(app: &tauri::App) {
    let args: Vec<String> = std::env::args().collect();
    let opened_file = if args.len() > 1 {
        let file_path = args[1].clone();
        if is_supported_file(&file_path) {
            Some(file_path)
        } else {
            None
        }
    } else {
        None
    };

    // Store the opened file path in app state
    app.manage(OpenedFilePath(Mutex::new(opened_file.clone())));

    // Emit event to frontend if a file was opened
    if let Some(file_path) = opened_file {
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.emit("file-opened", file_path);
        }
    }
}

/// macOS-specific: Initialize state and check CLI arguments
/// On macOS, "Open With" uses CLI args when launching the app,
/// but uses Opened event when the app is already running
#[cfg(target_os = "macos")]
pub fn setup_macos_file_opener(app: &tauri::App) {
    eprintln!("========================================");
    eprintln!("[file_opener] macOS setup starting...");
    eprintln!("========================================");
    
    // Log ALL environment variables to see if file path is passed differently
    eprintln!("[file_opener] Environment variables:");
    for (key, value) in std::env::vars() {
        if key.contains("FILE") || key.contains("PATH") || key.contains("OPEN") {
            eprintln!("[file_opener]   {}: {}", key, value);
        }
    }
    
    // Check CLI arguments (for when app is launched via "Open With")
    let args: Vec<String> = std::env::args().collect();
    eprintln!("[file_opener] ========================================");
    eprintln!("[file_opener] CLI args count: {}", args.len());
    for (i, arg) in args.iter().enumerate() {
        eprintln!("[file_opener] arg[{}]: {}", i, arg);
    }
    eprintln!("[file_opener] ========================================");
    
    let opened_file = if args.len() > 1 {
        let file_path = args[1].clone();
        eprintln!("[file_opener] Checking CLI arg: {}", file_path);
        if is_supported_file(&file_path) {
            eprintln!("[file_opener] ✅ Valid file from CLI: {}", file_path);
            Some(file_path)
        } else {
            eprintln!("[file_opener] ❌ Unsupported file type from CLI: {}", file_path);
            None
        }
    } else {
        eprintln!("[file_opener] No CLI args provided");
        None
    };

    // Store the opened file path in app state
    app.manage(OpenedFilePath(Mutex::new(opened_file.clone())));
    eprintln!("[file_opener] State initialized with: {:?}", opened_file);

    // Emit event to frontend if a file was opened
    if let Some(file_path) = opened_file {
        eprintln!("[file_opener] Attempting to emit file-opened event...");
        if let Some(window) = app.get_webview_window("main") {
            match window.emit("file-opened", file_path.clone()) {
                Ok(_) => eprintln!("[file_opener] ✅ Event emitted successfully"),
                Err(e) => eprintln!("[file_opener] ❌ Failed to emit event: {}", e),
            }
        } else {
            eprintln!("[file_opener] ⚠️ Main window not found, event not emitted");
        }
    }
    
    eprintln!("[file_opener] macOS setup complete");
    eprintln!("========================================");
}

/// macOS-specific: Handle the Opened event when files are opened with the app
#[cfg(target_os = "macos")]
pub fn handle_macos_opened_event(app_handle: &AppHandle, urls: Vec<tauri::Url>) {
    use std::panic;
    
    // Wrap in catch_unwind to prevent crashes
    let result = panic::catch_unwind(panic::AssertUnwindSafe(|| {
        if urls.is_empty() {
            eprintln!("[file_opener] No URLs provided in Opened event");
            return;
        }

        let url = match urls.first() {
            Some(u) => u,
            None => {
                eprintln!("[file_opener] Failed to get first URL");
                return;
            }
        };

        // Remove "file://" prefix if present
        let file_path = url.to_string().replace("file://", "");
        eprintln!("[file_opener] Processing opened file: {}", file_path);

        // Check if it's a supported file type
        if !is_supported_file(&file_path) {
            eprintln!("[file_opener] Unsupported file type: {}", file_path);
            return;
        }

        // Store in state
        match app_handle.try_state::<OpenedFilePath>() {
            Some(state) => {
                match state.0.lock() {
                    Ok(mut guard) => {
                        *guard = Some(file_path.clone());
                        eprintln!("[file_opener] Stored file path in state");
                    }
                    Err(e) => {
                        eprintln!("[file_opener] Failed to lock state mutex: {}", e);
                        return;
                    }
                }
            }
            None => {
                eprintln!("[file_opener] OpenedFilePath state not found");
                return;
            }
        }

        // Try to emit to frontend (may not be ready yet)
        match app_handle.get_webview_window("main") {
            Some(window) => {
                match window.emit("file-opened", file_path.clone()) {
                    Ok(_) => eprintln!("[file_opener] Successfully emitted file-opened event"),
                    Err(e) => eprintln!("[file_opener] Failed to emit event: {}", e),
                }
            }
            None => {
                eprintln!("[file_opener] Main window not found, file will be retrieved via command");
            }
        }
    }));

    if let Err(e) = result {
        eprintln!("[file_opener] Panic caught in handle_macos_opened_event: {:?}", e);
    }
}
