const fs = require('fs');
const GoLRLE = require('./GolRLE.js');

function initialize_from_file(data) {
    let draw_state = [];
    for (let i = 0; i < data.length; i++) {
        let row_data = data[i];
        if (!row_data) continue;
        for (let j = 0; j < row_data.length; j++) {
            if (row_data[j] === 1) {
                draw_state.push([i, j]);
            }
        }
    }
    return draw_state;
}


function importPattern(req, res) {
    let query = req.query;
    let path = './data/' + query.file;
    let rle = new GoLRLE().decode(fs.readFileSync(path, 'utf8'));

    let rows = initialize_from_file(rle.rows);

    let data = {
        width: rle.width,
        height: rle.height,
        rows: rows,
        sucsess: true
    };

    res.setHeader('content-type', 'application/json');
    res.send(data);
}

module.exports = {
    importPattern
};