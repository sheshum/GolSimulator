const fs = require('fs');
const express = require('express');
const cors = require('cors');

const GoLRLE = require('./GolRLE.js');


const PORT = 5000;
const app = express();


app.use(cors({origin: '*' }));

app.get('/import', (req, res) => {
    let query = req.query;
    console.log("Import file request: ", query);
    let path = './data/' + query.file;
    let rle = new GoLRLE().decode(fs.readFileSync(path, 'utf8'));

    let rows = initialize_from_file(rle.rows);

    let data = {
        width: rle.width,
        height: rle.height,
        rows: rows,
        sucsess: true
    };

    console.log("Returning: ", data);

    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('content-type', 'application/json');
    res.send(data);
});

app.listen(PORT, () => console.log('Listening on port ', PORT));

function initialize_from_file(data) {
    let draw_state = [];
    for (let i = 0; i < data.length; i++) {
        let row_data = data[i];
        if (!row_data) continue;
        for (let j = 0; j < row_data.length; j++) {
            // console.log("Cell data: ", row_data[j]);
            if (row_data[j] === 1) {
                // let key = get_row_col_key(i, j);
                // add_cell(key, current_life, dead_neighbours_hash);
                draw_state.push([i, j]);
            }
        }
    }
    console.log(draw_state);
    return draw_state;
}