// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use window_shadows::set_shadow;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(any(target_os = "macos", windows))]
            {
                let window = app.get_window("main").unwrap();
                set_shadow(&window, true).expect("Unsupported platform!");
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
