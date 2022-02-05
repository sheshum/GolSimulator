import PanZoom from "./panZoom.js";

const CELL_COLOR = "#38abd1";
let cell_size = 10;
const DISPLAY_GRID = false;

let scaleRate = 2;


const GolScreen = {
    initialized: false,
    canvas_dom_element: null,
    context: null,
    width: 0,
    height: 0,

    init: function(width, height, canvas_element_id) {
        this.width = width;
        this.height = height;
        this.canvas_dom_element = document.getElementById(canvas_element_id);
        this.canvas_dom_element.width = width;
        this.canvas_dom_element.height = height;
        this.context = this.canvas_dom_element.getContext("2d");

        this.initialized = true;
    },

    update_mouse_pos() {
        
        let mouse = PanZoom.mouse;
        if (mouse.down) {
            if (!mouse.drag) {
                mouse.drag = true;
                mouse.lastX = mouse.x;
                mouse.lastY = mouse.y;
            } else {
                PanZoom.deltaX += mouse.x - mouse.lastX;
                PanZoom.deltaY += mouse.y - mouse.lastY;
    
                mouse.lastX = mouse.x;
                mouse.lastY = mouse.y;
            }
        } else if(mouse.drag) {
            mouse.drag = false;
        }
    },

    draw_grid() {
        if (!DISPLAY_GRID) return;

        let ctx = this.context;

        let scale = 1 / PanZoom.scale;
        let gScale = cell_size;
 

        const startX = ((-PanZoom.deltaX * scale - gScale) / gScale | 0) * gScale;
        const startY = ((-PanZoom.deltaY * scale - gScale) / gScale | 0) * gScale;

        let total = this.width * scale + 2*gScale;

        ctx.lineWidth = 0.2;
        ctx.strokeStyle = 'gray';


        PanZoom.apply(ctx);

        ctx.beginPath();
        for (let i = 0; i <= total; i += cell_size) {

            // Vertical
            ctx.moveTo(startX + i, startY);
            ctx.lineTo(startX + i, startY + total);

            // Horizontal line
            ctx.moveTo(startX, startY + i);
            ctx.lineTo(startX + total, startY + i);

        }

        PanZoom.reset(ctx); // reset the transform so that lineWidth doesn't change with scale
        ctx.stroke();
    },
    
    draw_cell(row, col) {
        this.context.fillStyle = CELL_COLOR;
        this.context.fillRect(
            col * cell_size,
            row * cell_size,
            cell_size,
            cell_size
        );
    },
    
    draw_life(draw_data) {
        PanZoom.apply(this.context);

        draw_data.forEach(coordinate => {
            let [ row, col ] = coordinate;
            this.draw_cell(row, col);
        });

        PanZoom.reset(this.context);
    },

    draw(draw_data) {

        PanZoom.reset(this.context);
        this.context.clearRect(-cell_size, -cell_size, this.width + 2*cell_size, this.height + 2*cell_size);

        this.draw_grid();
        this.draw_life(draw_data);

        // console.log(`screen.js::draw:: drawing finished (draw_data length= ${draw_data.length})`);
    },

    init_listeners() {
        let canvas = this.canvas_dom_element;
        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.button === 2) PanZoom.mouse.down = true;
        });

        canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            if (e.button === 2) PanZoom.mouse.down = false;
        });
    
        canvas.addEventListener('mousemove', (e) => {
            let client_rect = canvas.getBoundingClientRect();
    
            PanZoom.mouse.x = e.clientX - client_rect.left;
            PanZoom.mouse.y = e.clientY - client_rect.top;
        });

        canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // prevent right click menu from opening

        const btn_zoom_in = document.getElementById("btn-zoom-in");
        const btn_zoom_out = document.getElementById("btn-zoom-out");

        btn_zoom_in.addEventListener("click", () => PanZoom.scaleAt(scaleRate));
        btn_zoom_out.addEventListener("click", () => PanZoom.scaleAt(1/scaleRate));

        
    }

};

export default GolScreen;