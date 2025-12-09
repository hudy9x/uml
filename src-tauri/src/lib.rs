// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn toggle_devtools(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        #[cfg(debug_assertions)]
        {
            if window.is_devtools_open() {
                let _ = window.close_devtools();
            } else {
                let _ = window.open_devtools();
            }
        }
        #[cfg(not(debug_assertions))]
        {
            // In production, always try to toggle (devtools: true in config enables this)
            if window.is_devtools_open() {
                let _ = window.close_devtools();
            } else {
                let _ = window.open_devtools();
            }
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
