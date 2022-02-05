/**
 * 
 * TODO: Add description
 * 
 */


import {
    random_coordinates,
    get_row_col_key,
    parse_row_col_key
} from './helpers';


let current_life = {};
let dead_neighbours_hash = {};


function get_neighbour_keys(cell_key) {
    let [row, col] = parse_row_col_key(cell_key);

    let north_west = get_row_col_key(row - 1, col - 1);
    let north = get_row_col_key(row - 1, col);
    let north_east = get_row_col_key(row - 1, col + 1);
    let west = get_row_col_key(row, col - 1);
    let east = get_row_col_key(row, col + 1);
    let south_west = get_row_col_key(row + 1, col - 1);
    let south = get_row_col_key(row + 1, col);
    let south_east = get_row_col_key(row + 1, col + 1);

    return [
        north_west, north, north_east,
        west, east,
        south_west, south, south_east
    ];
}

function add_cell(cell_key, state, all_dead_neighbours) {
    let live_neighbours_count = 0;
    let cell_neighbours_keys = get_neighbour_keys(cell_key);

    cell_neighbours_keys.forEach(neighbour_key => {
        if (state[neighbour_key] >= 0) {
            state[neighbour_key]++;
            live_neighbours_count++;
        } else {
            all_dead_neighbours[neighbour_key] = (all_dead_neighbours[neighbour_key] || 0) + 1;
        }
    });

    state[cell_key] = live_neighbours_count;
    delete all_dead_neighbours[cell_key];
}


/**
 * Create a new temp state
 * Iterate over each cell in the current state
 * Check neighbour count
 * 
 * TODO: Consider adding a callback that wil be called when each new cell is added
 * This way we can pass the logic for cell drawing to the gol engine,
 * and dont have to create separate array for drawing and iterate over it.
 * This will also enable optimizing canvas drawing, because
 * we can only update cells on the canvas which state has changed.
 * @param {Function} onCellAdded
 * 
*/
export function next_generation(onCellAdded = null) {

    let

        /**
         * Temporary cache for new current state
         */
        temp_life_hash = {},


        /**
         * Temporary cache for dead cells that have one or more alive neighbours
         */
        temp_dead_neighbours_hash = {},



        /**
         * Data that will be use for drawing.
         * TODO: Consider the data structure, should it contain col/row pairs or cell key with alive/dead state.
         * Second way of storing data allows drawing optimization so that we don't have to redraw the whole canvas
         * but just cells which state has changed.
         */
        draw_life = [];


    for (let cell_key in current_life) {
        if (current_life[cell_key] >= 2 && current_life[cell_key] <= 3) {
            add_cell(
                cell_key,
                temp_life_hash,
                temp_dead_neighbours_hash
            );

            let [ row, col ] = parse_row_col_key(cell_key);
            draw_life.push([row, col]);
        }
    }

    for (let dead_cell_key in dead_neighbours_hash) {
        if (dead_neighbours_hash[dead_cell_key] === 3) {
            add_cell(
                dead_cell_key,
                temp_life_hash,
                temp_dead_neighbours_hash
            );
            
            let [ row, col ] = parse_row_col_key(dead_cell_key);
            draw_life.push([row, col]);
        }
    }


    current_life = temp_life_hash;
    dead_neighbours_hash = temp_dead_neighbours_hash;


    return draw_life;
}

export function initialize(initial_state, randomize, spread, DIM) {
    
    let draw_state = [];
    current_life = {};
    dead_neighbours_hash = {};
    
    console.log(`Initializing new state (randomize=${randomize}, initial_state length=${initial_state.length})`);


    if (typeof randomize !== "boolean") randomize = false;
    if (spread >= DIM) spread = Math.floor(DIM * 0.5);
    
    if (randomize) {
        let hashed = {};
        while (draw_state.length < Math.floor(DIM * spread)) {
            let [ row, col] = random_coordinates(hashed);
            let key = get_row_col_key(row, col);
            add_cell(key, current_life, dead_neighbours_hash);
            draw_state.push([row, col]);
        }
    } else {
        initial_state.forEach(coordinate => {
            let key = get_row_col_key(coordinate[0], coordinate[1]);
            add_cell(key, current_life, dead_neighbours_hash);
            draw_state.push(coordinate);
        });
    }

    console.log("State initialized, cells: ", draw_state.length);
    return draw_state;

}