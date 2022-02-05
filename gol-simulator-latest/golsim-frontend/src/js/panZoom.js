

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

    reset(context) { context.setTransform(1, 0, 0, 1, 0, 0); }
}

export default PanZoom;