let numOfRows = 38, numOfCols = 70;
let cellSize = 16, offset = 0;

let infoDialog;

const BACKGROUND_COLOR = 'rgb(65, 66, 68)';
const SQUARE_EDGE_COLOR = "gray";
const ALIVE_CELL_COLOR = "#ffec64"

const FPS = 10;

const PRESETS = {
    0: [
        [1, 26], [2, 24], [2, 26], [3, 14], [3, 15], [3, 22], [3, 23], [3, 36], [3, 37], [4, 13], [4, 17], [4, 22], [4, 23], [4, 36], [4, 37],
        [5, 2], [5, 3], [5, 12], [5, 18], [5, 22], [5, 23], [6, 2], [6, 3], [6, 12], [6, 16], [6, 18], [6, 19], [6, 24], [6, 26],
        [7, 12], [7, 18], [7, 26], [8, 13], [8, 17], [9, 14], [9, 15]
    ],
    1: []
}

function _log(msg) {
    console.log("GOL :: ", msg);
}
function _logError(error) {
    console.log("GOL Error: ", error);
}

function create2DArray(row, col, fillWith) {
    const arr = new Array(row);
    for (let i = 0; i < row; i++) {
        arr[i] = new Array(col).fill(0);
    }
    return arr;
}

function calcCellCoordinates(i, j, cellSpace, cellSize) {
    const x = cellSpace + (cellSize + cellSpace) * j;
    const y = cellSpace + (cellSize + cellSpace) * i;
    return [ x, y ];
}

const GOL = {

    running: false,

    time: { start: 0 },


    listLife: {

    },

    grid: {

        data: [[]],
        rows: numOfRows,
        cols: numOfCols,

        init() {
            const matrix = create2DArray(this.rows, this.cols, 0);
            this.data = matrix;
        },

        forEachCell(callback) {
            const row = this.data.length;
            for (let i = 0; i < row; i++) {
                const col = this.data[i].length;
                for (let j = 0; j < col; j++) {
                    const val = this.data[i][j];
                    callback(val, i, j);
                }
            }
        },

        getVal(row, col) {
            let val;
            const rowData = this.data[row];
            if (rowData) {
                val = rowData[col];
            }

            if (val === null || typeof val === "undefined") {
                return null;
            }
            return val;
        },

        setVal(row, col, val) {
            this.data[row][col] = val; 
        },

        reset() {
            const emptyGrid = create2DArray(numOfRows, numOfCols, 0);
            this.data = emptyGrid;
        },

        switchCell(rowIndex, colIndex) {

            const val = this.getVal(rowIndex, colIndex);
            const newVal = val === 0 ? 1 : 0;
           
            this.setVal(rowIndex, colIndex, newVal);
            
            const isAlive = newVal === 1 ? true : false;
            const [ x, y ] = calcCellCoordinates(rowIndex, colIndex, offset, cellSize);
            GOL.canvas.drawCell(x, y, cellSize, isAlive);
        },

        countALiveNeighbours(rowIndex, colIndex) {
            let num = 0;
            const neighbours = [
                [rowIndex - 1, colIndex - 1],
                [rowIndex -1, colIndex],
                [rowIndex - 1, colIndex + 1],
                [rowIndex, colIndex -1],
                [rowIndex, colIndex + 1],
                [rowIndex + 1, colIndex -1],
                [rowIndex + 1, colIndex],
                [rowIndex + 1, colIndex + 1]
            ];

            neighbours.forEach(val => {
                const state = this.getVal(val[0], val[1]);
                if (state) {
                    num += state;
                }
            });

            return num;
        }
    },

    canvas: {


        ctx: null,
        canvasDOM: null,

        init() {
            this.canvasDOM = document.getElementById('canvas');
            this.ctx = this.canvasDOM.getContext('2d');

            this.width = numOfCols * (cellSize + offset) + offset;
            this.height = numOfRows * (cellSize + offset) + offset;

            this.canvasDOM.setAttribute('width', this.width);
            this.canvasDOM.setAttribute('height', this.height);

            this.canvasDOM.addEventListener("mousedown", GOL.handlers.canvasMouseDown, false);
        },

        drawWorld() {
            this.ctx.fillStyle = BACKGROUND_COLOR;
            this.ctx.fillRect(0, 0, this.width, this.height);


            GOL.grid.forEachCell((val, i, j) => {
                const [ x, y ] = calcCellCoordinates(i, j, offset, cellSize);
                const isAlive = val === 0 ? false : true;
                this.drawCell(x, y, cellSize, isAlive);
            });
        },

        drawCell(x, y, cellSize, isAlive) {

            // Clear edge
            this.ctx.strokeStyle = BACKGROUND_COLOR;
            this.ctx.strokeRect(x, y, cellSize, cellSize);

            // Color inside
            if (isAlive) {
                this.ctx.fillStyle = ALIVE_CELL_COLOR;
                this.ctx.fillRect(x, y, cellSize, cellSize);
                
            } else {
                this.ctx.fillStyle = BACKGROUND_COLOR;
                this.ctx.fillRect(x, y, cellSize, cellSize);
            }

            // Color the edge
            this.ctx.strokeStyle = SQUARE_EDGE_COLOR;
            this.ctx.strokeRect(x, y, cellSize, cellSize);
        },

        switchCell(rowIndex, colIndex) {

            let isAlive = false;
            const current = GOL.grid.data[rowIndex][colIndex];
            if (current === 0) {
                GOL.grid.setVal(rowIndex, colIndex, 1);
                isAlive = true;
            } else {
                GOL.grid.setVal(rowIndex, colIndex, 1);
            }

            const [ x, y ] = calcCellCoordinates(rowIndex, colIndex, offset, cellSize);
            this.drawCell(x, y, cellSize, isAlive);
        }
    },



    handlers: {

        buttons: {},

        initButtons() {
            this.buttons.buttonNext = document.getElementById("next");
            this.buttons.buttonStart = document.getElementById("start");
            this.buttons.buttonStop = document.getElementById("stop");
            this.buttons.buttonClear = document.getElementById("clear");

            this.buttons.buttonNext.addEventListener("click", this.buttonNextStep);
            this.buttons.buttonStart.addEventListener("click", this.buttonStart);
            this.buttons.buttonStop.addEventListener("click", this.buttonStop);
            this.buttons.buttonClear.addEventListener("click", this.buttonClear);

            this.updateButtons(false);
        },

        updateButtons(running) {
            if (running) {
                this.buttons.buttonNext.setAttribute("disabled", true);
                this.buttons.buttonStart.setAttribute("disabled", true);
                this.buttons.buttonStop.removeAttribute("disabled");
                this.buttons.buttonClear.setAttribute("disabled", true);
            } else {
                this.buttons.buttonNext.removeAttribute("disabled");
                this.buttons.buttonStart.removeAttribute("disabled");
                this.buttons.buttonStop.setAttribute("disabled", true);
                this.buttons.buttonClear.removeAttribute("disabled");
            }
        },

        canvasMouseDown(event) {
            const [ rowIndex, colIndex ] = GOL.helpers.mousePosition(event);
            GOL.grid.switchCell(rowIndex, colIndex);
        },

        buttonNextStep(event) {
            GOL.nextTick();
            GOL.canvas.drawWorld();
        },

        buttonStart() {
            if (GOL.running === false) {
                GOL.running = true;
                GOL.handlers.updateButtons(true);
            }
        },

        buttonStop() {

            GOL.running = false;
            GOL.handlers.updateButtons(false);
        },

        buttonClear() {
            GOL.grid.reset();
            GOL.canvas.drawWorld();
        },

        savePreset() {
            const preset = [];
            GOL.grid.forEachCell((val, i, j) => {
                if (val === 1) {
                    preset.push([i, j]);
                }
            });

            console.log(preset);
        },

        loadPreset(preset) {
            PRESETS[0].forEach(square => {
                GOL.grid.setVal(square[0], square[1], 1);
            })
        },

        openInfoDialog() {
            if (infoDialog) {
                // infoDialog.style.display = "block";
                infoDialog.classList.add("open");
            }
        },

        animate(timestamp = 0) {
            if (requestId) {
                cancelAnimationFrame(requestId);
            }

            const elapsed = timestamp - GOL.time.start;
            const delay = Math.ceil(1000 / FPS);

            if (elapsed > delay) {
                GOL.time.start = timestamp;
                if (GOL.running) {
                    GOL.nextTick();
                    GOL.canvas.drawWorld();
                }
            }

            requestId = requestAnimationFrame(GOL.handlers.animate);
        }
    },


    helpers: {


        mousePosition(e) {
            let posx = 0;
            let posy = 0;
            let event = e;
            let colIndex, rowIndex;

            if (!event) {
                event = window.event;
            }

            const rect = GOL.canvas.canvasDOM.getBoundingClientRect();
            posx = event.clientX - rect.left;
            posy = event.clientY - rect.top;

            colIndex = Math.floor((posx / (cellSize + offset)));
            rowIndex = Math.floor((posy / (cellSize + offset)));

            return [ rowIndex, colIndex ];
        }
    },


    initialize() {
        try {

            this.canvas.init();
            this.grid.init();

            this.handlers.loadPreset();
            this.canvas.drawWorld();


            this.handlers.initButtons();

        } catch (error) {
            _logError(error);
        }
    },



    nextTick() {


        const newGrid = create2DArray(numOfRows, numOfCols, 0);


        GOL.grid.forEachCell((current, rowIndex, colIndex) => {

            const neighbours = GOL.grid.countALiveNeighbours(rowIndex, colIndex);

            if (current === 0 && neighbours === 3) {
                newGrid[rowIndex][colIndex] = 1;
            } else if (current === 1 && (neighbours < 2 || neighbours > 3)) {
                newGrid[rowIndex][colIndex] = 0;
            } else {
                newGrid[rowIndex][colIndex] = current;
            }
        });


        GOL.grid.data = newGrid;
    },

    start() {
        GOL.handlers.updateButtons(false);
        GOL.handlers.animate();
    }
};

let requestId = null;

window.onload = function() {

    infoDialog = document.getElementById("infoDialog");
    const close = document.getElementsByClassName("close")[0];
    const btnInfo = document.getElementById("help");
    btnInfo.addEventListener("click", GOL.handlers.openInfoDialog);

    close.addEventListener("click", () => {
        if (infoDialog) {
            // infoDialog.style.display = "none";
            infoDialog.classList.remove("open");
        }
    });

    window.addEventListener("click", (e) => {
        if (e.target == infoDialog) {
            // infoDialog.style.display = "none";
            infoDialog.classList.remove("open");
        }
    });

    GOL.initialize();
    GOL.start();
}