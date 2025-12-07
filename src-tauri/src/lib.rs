// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
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
        .invoke_handler(tauri::generate_handler![
            greet,
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
            plantuml::generate_diagram
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
