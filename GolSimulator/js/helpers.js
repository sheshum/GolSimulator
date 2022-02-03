let infoLabel;

function initInfoLabel() {
    infoLabel = document.getElementById("label-info");
}

function updateInfoLabel() {
    if (!infoLabel) {
        return;
    }
    const gridTxt = displayGrid ? "On" : "Off";

    let scale = panZoom.scale;
    let ratio = (scale >= 1) ? `1:${scale}` : `${1/scale}:1`;

    infoLabel.innerHTML = `| X: ${mouse.x}, Y: ${mouse.y} |
        Col: ${col}, Row: ${row} | 
        Ratio ${ratio} | Grid: ${gridTxt}`;
}

function pixelsToColRow(pixelX, pixelY, dx, dy, scale) {
    let x = pixelX - dx;
    let y = pixelY - dy;
    let pixelCol = (x / (cellSize * scale)) | 0;
    let pixelRow = (y / (cellSize * scale)) | 0;
    return { pixelCol, pixelRow };
}