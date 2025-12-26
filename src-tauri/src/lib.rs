// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;

mod commands;
mod file_opener;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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
            // Setup platform-specific file opener
            #[cfg(target_os = "windows")]
            file_opener::setup_windows_file_opener(app);

            #[cfg(target_os = "macos")]
            file_opener::setup_macos_file_opener(app);

            // Register cleanup handler for when the app is closing
            let window = app
                .get_webview_window("main")
                .expect("Failed to get main window");
            window.on_window_event(
                move |event| {
                    if let tauri::WindowEvent::CloseRequested { .. } = event {}
                },
            );
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            file_opener::get_opened_file_path,
            toggle_devtools,
            open_devtools,
            close_devtools,
            commands::files::list_dir,
            commands::files::read_file_content,
            commands::files::write_file_content,
            commands::files::create_directory,
            commands::files::create_file,
            commands::files::delete_node,
            commands::files::rename_node,
            commands::file_dialog::open_file_dialog,
            commands::file_dialog::open_folder_dialog,
            commands::git::get_current_branch,
            commands::git::get_all_branches,
            commands::git::switch_branch,
            commands::git::get_git_status,
            commands::git::git_pull,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app_handle, event| {
            // Log ALL events to see what's happening
            // eprintln!("[lib.rs] Received event: {:?}", event);
            
            // macOS: Handle file opened events
            #[cfg(target_os = "macos")]
            if let tauri::RunEvent::Opened { urls } = event {
                eprintln!("[lib.rs] ✅ Opened event detected with {} URLs", urls.len());
                for (i, url) in urls.iter().enumerate() {
                    eprintln!("[lib.rs] URL {}: {}", i, url);
                }
                file_opener::handle_macos_opened_event(&app_handle, urls);
            }
        });
}
