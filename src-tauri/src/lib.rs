// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{Emitter, Manager};
use std::sync::Mutex;

// Global state to store the opened file path
struct OpenedFilePath(Mutex<Option<String>>);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_opened_file_path(state: tauri::State<OpenedFilePath>) -> Option<String> {
    state.0.lock().unwrap().clone()
}

#[tauri::command]
fn toggle_devtools(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_devtools_open() {
            let _ = window.close_devtools();
        } else {
            let _ = window.open_devtools();
        }
    }
}

#[tauri::command]
fn open_devtools(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.open_devtools();
    }
}

#[tauri::command]
fn close_devtools(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.close_devtools();
    }
}

mod files;
mod git;
mod plantuml;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Capture CLI arguments to check if a file was opened
            let args: Vec<String> = std::env::args().collect();
            let opened_file = if args.len() > 1 {
                // The file path is typically the second argument (first is the executable)
                let file_path = args[1].clone();
                // Check if it's a .pu or .puml file
                if file_path.ends_with(".pu") || file_path.ends_with(".puml") {
                    Some(file_path.clone())
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
                let window = app.get_webview_window("main").expect("Failed to get main window");
                let _ = window.emit("file-opened", file_path);
            }

            // Register cleanup handler for when the app is closing
            let window = app.get_webview_window("main").expect("Failed to get main window");
            window.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { .. } = event {
                    // Stop PlantUML server when window is closing
                    tauri::async_runtime::spawn(async move {
                        if let Err(e) = plantuml::cleanup_plantuml_server().await {
                            eprintln!("Failed to stop PlantUML server on exit: {}", e);
                        }
                    });
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_opened_file_path,
            toggle_devtools,
            open_devtools,
            close_devtools,
            files::list_dir,
            files::read_file_content,
            files::write_file_content,
            files::create_directory,
            files::create_file,
            files::delete_node,
            files::rename_node,
            git::get_current_branch,
            git::get_all_branches,
            git::switch_branch,
            git::get_git_status,
            git::git_pull,
            plantuml::start_plantuml_server,
            plantuml::stop_plantuml_server,
            plantuml::check_plantuml_server
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
