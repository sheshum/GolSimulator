let scaleRate = 2;

const PanZoom = {
    deltaX: 0,
    deltaY: 0,
    scale: 0.2,
    mouse: {
        down: false,
        drag: false,
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0
    },

    scaleAt(sc) {
        this.scale *= sc;
    },

    apply(context) {
        context.setTransform(
            this.scale,
            0,
            0,
            this.scale,
            this.deltaX,
            this.deltaY
        );
    },

    reset(context) { context.setTransform(1, 0, 0, 1, 0, 0); },

    update_mouse_pos() {
        let mouse = this.mouse;
        if (mouse.down) {
            if (!mouse.drag) {
                mouse.drag = true;
                mouse.lastX = mouse.x;
                mouse.lastY = mouse.y;
            } else {
                this.deltaX += mouse.x - mouse.lastX;
                this.deltaY += mouse.y - mouse.lastY;
    
                mouse.lastX = mouse.x;
                mouse.lastY = mouse.y;
            }
        } else if(mouse.drag) {
            mouse.drag = false;
        }
    },

    init_listeners(canvas_element) {
        canvas_element.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (e.button === 2) this.mouse.down = true;
        });

        canvas_element.addEventListener('mouseup', (e) => {
            e.preventDefault();
            if (e.button === 2) this.mouse.down = false;
        });
    
        canvas_element.addEventListener('mousemove', (e) => {
            let client_rect = canvas_element.getBoundingClientRect();
    
            this.mouse.x = e.clientX - client_rect.left;
            this.mouse.y = e.clientY - client_rect.top;
        });

        canvas_element.addEventListener('contextmenu', (e) => e.preventDefault()); // prevent right click menu from opening

        const btn_zoom_in = document.getElementById("btn-zoom-in");
        const btn_zoom_out = document.getElementById("btn-zoom-out");

        btn_zoom_in.addEventListener("click", () => this.scaleAt(scaleRate));
        btn_zoom_out.addEventListener("click", () => this.scaleAt(1/scaleRate));
    }
}