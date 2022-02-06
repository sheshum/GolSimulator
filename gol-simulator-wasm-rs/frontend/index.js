import * as wasm from "gol-simulator-wasm-rs";

// just for testing importing js in rust
wasm.tick();

const container = document.createElement('div');
container.classList.add('screen-container');

const canvas = document.createElement('canvas');
canvas.width = 500;
canvas.height = 500;

canvas.buffer = document.createElement('canvas');
canvas.buffer.width = 500;
canvas.buffer.height = 500;


canvas.setAttribute('id', 'buffer-screen');


container.appendChild(canvas);
document.body.appendChild(container);


const ctx = canvas.getContext('2d');
const buffer_ctx = canvas.buffer.getContext('2d');

buffer_ctx.setTransform(0.5, 0, 0, 0.5, 0, 0);
buffer_ctx.fillStyle = 'black';
buffer_ctx.fillRect(0, 0, canvas.buffer.width, canvas.buffer.height);
buffer_ctx.setTransform(1, 0, 0, 1, 0, 0);


ctx.drawImage(canvas.buffer, 0, 0);

