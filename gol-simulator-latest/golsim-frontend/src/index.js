import GolScreen from './js/screen.js';
import { next_generation, initialize } from './js/gol';

import './css/style.css';




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


const RANDOMIZE = false;

const ENV_DEBUG = false;
const timer_label = "gol_timer";

let animation_frame_id;

function inject_html_components() {
    const body_content = `
        <div class="screen-container">
            <canvas id="screen"></canvas>
        </div>
        <gol-toolbar class="tool-bar">
            <button class="button-5" id="btn-start">Run</button>
            <button class="button-5" id="btn-stop">Stop</button>
            <button class="button-5" id="btn-import">Import</button>
            <button class="button-5" id="btn-zoom-in"><i class="fa fa-search-plus"></i></button>
            <button class="button-5" id="btn-zoom-out"><i class="fa fa-search-minus"></i></button>
        </gol-toolbar>
    `;

    document.body.innerHTML = body_content;
}

function importFromFile() {
    let pattern = "cousinprimecalculator";
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
    GolScreen.update_mouse_pos();

    if (ENV_DEBUG) console.time(timer_label);


    let draw_life = next_generation();


    if (ENV_DEBUG) console.timeEnd(timer_label);


    GolScreen.draw(draw_life);


    animation_frame_id = requestAnimationFrame(start_loop);
}

function pause_loop() {
    if (animation_frame_id) cancelAnimationFrame(animation_frame_id);
}

function initialize_app() {
    return function() {

        inject_html_components();

        GolScreen.init(WW, WH, "screen");
        GolScreen.init_listeners();

        document.getElementById('btn-start').addEventListener('click', start_loop);
        document.getElementById('btn-stop').addEventListener('click', pause_loop);
        document.getElementById('btn-import').addEventListener('click', importFromFile)

        let draw_life = RANDOMIZE
            ? initialize(null, true, 20, DIM)
            : initialize(initial_state, false);

        GolScreen.draw(draw_life);
    }
}

// window.onload = start;
window.onload = initialize_app();