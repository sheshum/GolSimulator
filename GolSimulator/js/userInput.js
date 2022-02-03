// If this falg is true panZoom.x and panZoom.y will gradiually decrease;
let returnToCenterStarted = false;
let returnToCentreRate = 10;

function setupMouseEvents() {
    document.addEventListener("mousemove",updateMouse);
    document.addEventListener("mousedown", () => mouse.down = true);
    document.addEventListener("mouseup", () => mouse.down = false);
}

function setupButtonEvents() {
    const btnZoomIn = document.getElementById("btn-zoom-in");
    const btnZoomOut = document.getElementById("btn-zoom-out");
    const btnRestoreZoom = document.getElementById("btn-restore-scale");
    const btnToggleGrid = document.getElementById("btn-toggle-grid");
    const btnReCentre = document.getElementById("btn-recentre");

    btnZoomIn.addEventListener("click", () => panZoom.scaleAt(scaleRate));
    btnZoomOut.addEventListener("click", () => panZoom.scaleAt(1/scaleRate));
    btnRestoreZoom.addEventListener("click", () => panZoom.scale = 1);
    btnToggleGrid.addEventListener("click", () => displayGrid = !displayGrid);
    btnReCentre.addEventListener("click", () => {
        panZoom.x = 0;
        panZoom.y = 0;
    });
}