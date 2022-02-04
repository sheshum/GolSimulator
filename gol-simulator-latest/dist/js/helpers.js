
// Methods for working with column and row indices
const get_row_col_key = (row, col) => `${row}:${col}`;

const parse_row_col_key = (key) => {
    let [left, right] = key.split(":");
    return [
        parseInt(left, 10),
        parseInt(right, 10)
    ];
};

// ------------------------------------------------------


//  #### RANDOMIZE ####
const random = (max, min) => Math.floor(Math.random() * (max - min) + min);

const random_coordinates = (hashed) => {
    let row = (random(0, WH - cell_size) / cell_size) | 0;
    let col = (random(0, WW - cell_size) / cell_size) | 0;

    let key = `${row}:${col}`;


    if (!hashed[key]) {
        hashed[key] = 1;
        return [ row, col ];
    }

    return random_coordinates(hashed);
};

// ------------------------------------------------------

const coordinates_to_indices = (x, y, cell_size) => {
    let col = ((x / cell_size) * 1/PanZoom.scale) | 0;
    let row = ((y / cell_size) * 1/PanZoom.scale) | 0;

    return [col, row];
}