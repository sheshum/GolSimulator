
let cell_size = 10;
let DIM = 80;
let WW = window.innerWidth;
let WH = window.innerHeight;


const GLIDER = [[3, 6], [4, 7], [5, 5], [5, 6], [5, 7]];
const OSCILATOR = [[15, 5], [15, 6], [15, 7]];
const STIL_LIFE = [[2, 20], [3, 20], [3, 21]];

let initial_state = [
    ...GLIDER,
    ...OSCILATOR,
    ...STIL_LIFE
];

const DISPLAY_GRID = false;
const RANDOMIZE = false;
const timer_label = "gol_timer";

let animation_frame_id;

function importFromFile(pattern = "cousinprimecalculator") {

    let url = `http://localhost:5000/import?file=${pattern}.rle`;
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return fetch(url, options)
        .then((response) => response.json())
        .then((data) => {

            let draw_life = initialize(data.rows, false);
            GolScreen.draw(draw_life);
        });
}

function start_loop() {
    PanZoom.update_mouse_pos();

    // console.time(timer_label);
    let draw_life = next_generation();
    // console.timeEnd(timer_label);


    GolScreen.draw(draw_life);


    animation_frame_id = requestAnimationFrame(start_loop);
}

function pause_loop() {
    if (animation_frame_id) cancelAnimationFrame(animation_frame_id);
}

function initialize_app() {
    return function() {
        GolScreen.init(WW, WH, "screen");
        PanZoom.init_listeners(GolScreen.get_canvas());

        let draw_life = RANDOMIZE
            ? initialize(null, true, 20, DIM)
            : initialize(initial_state, false);

        GolScreen.draw(draw_life);
    }
}

// window.onload = start;
window.onload = initialize_app();