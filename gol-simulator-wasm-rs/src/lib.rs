mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen(module = "/frontend/assets/js/screen.js")]
extern {
    fn add_cell();
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, gol-simulator-wasm-rs!");
}

#[wasm_bindgen]
pub fn tick() {
    add_cell();
}