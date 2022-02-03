let canvas, ctx;

let BACKGROUND_COLOR =  "#151d29";
let CELL_COLOR = "white";
let GRID_LINE_COLOR = "gray";

let displayGrid = false;
const NO_GRID_SPACING = 0.8;

const mouse = { x: 0, y: 0, lastX: 0, lastY: 0, down: false, drag: false };

let col = 0, row = 0;


let cellSize = 10;
let scale = 1, scaleRate = 2;

const panZoom = {
    x: 0,
    y: 0,
    scale: 1,
    scaleAt: function(sc) {
        this.scale *= sc;
    },
    apply: function() {
        ctx.setTransform(
            this.scale, // - Horizontal scaling
            0, // - Horizontal skewing
            0, // - Vertical skewing
            this.scale, // - Vertical scaling
            this.x, // - Horizontal moving
            this.y  // - Vertical moving
        );
    }
}

const life = ["10;10", "11;10", "10;11", "11;11"];
const DELIMITER = ";";

let FPS = 30;
let refreshInterval = 1000 / FPS;

window.onload = function() {
    initCanvas();

    initInfoLabel();

    setupButtonEvents();
    setupMouseEvents();

    setInterval(animate, refreshInterval);
}

function animate() {
    updateLife();
    // Draw everything
    resetCanvas();
    drawLife();
    drawGrid();
    updateInfoLabel();
}

function initCanvas() {
    canvas = document.getElementById("canv");
    ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function updateLife() {
    // ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    // ctx.globalAlpha = 1;

    if (mouse.down) {
        if (!mouse.drag) {
            mouse.drag = true;
            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
        } else {
            panZoom.x += mouse.x - mouse.lastX;
            panZoom.y += mouse.y - mouse.lastY;

            mouse.lastX = mouse.x;
            mouse.lastY = mouse.y;
        }
    } else if (mouse.drag) {
        mouse.drag = false;
    }
}

function updateMouse(evt) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;

    mouse.x = evt.clientX - rect.left - root.scrollLeft;
    mouse.y = evt.clientY - rect.top - root.scrollTop;
    
    const { pixelCol, pixelRow } = pixelsToColRow(mouse.x, mouse.y, panZoom.x, panZoom.y, panZoom.scale);
    col = pixelCol;
    row = pixelRow;
}

function resetCanvas() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(-cellSize, -cellSize, canvas.width + 2*cellSize, canvas.height + 2*cellSize);
}

function drawLife() {
    life.forEach(cell => {
        let [c, r] = cell.split(DELIMITER);
        c = parseInt(c);
        r = parseInt(r);
        const x = c * cellSize;
        const y = r * cellSize;

        const d = displayGrid ? cellSize : cellSize * NO_GRID_SPACING;

        panZoom.apply();

        ctx.fillStyle = CELL_COLOR;
        ctx.fillRect(x, y, d, d);
    });
}

function drawGrid() {
    if (!displayGrid) {
        return;
    }

    let w = canvas.width;
    let h = canvas.height;

    let scale = 1 / panZoom.scale;
    let gScale = cellSize;

    let total = Math.max(w, h) * scale + 2 * gScale;

    /**
     * Start one square up and left out of canvas
     * 
     * (-panZoom.x * scale - gScale) - Expression scales current canvas pan and adds
     * one cell to the length of the pan.
     * 
     * ((-panZoom.x * scale - gScale) / gScale | 0) - Expression gets total number of cells
     * that can be contained in the pan lenght.
     * 
     * At the end we multiply number of cells with cell length so that we get exact starting positions
     * for x and y
     * 
     */
    // const x = ((-panZoom.x * scale - gScale) / gScale | 0) * gScale;
    // const y = ((-panZoom.y * scale - gScale) / gScale | 0) * gScale;

    const x = ((-panZoom.x - gScale) / gScale | 0) * gScale;
    const y = ((-panZoom.y - gScale) / gScale | 0) * gScale;



    panZoom.apply();

    ctx.lineWidth = 0.1;
    ctx.strokeStyle = GRID_LINE_COLOR;

    ctx.beginPath();

    for (let i = 0; i < total; i += gScale) {
        ctx.moveTo(x + i, y); // move to next  column
        ctx.lineTo(x + i, y + total); // draw vertical (column) line
        ctx.moveTo(x, y + i); // move to next row
        ctx.lineTo(x + total, y + i); // draw vertical (row) line
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset the transform so that lineWidth doesn't change with scale
    ctx.stroke();
}