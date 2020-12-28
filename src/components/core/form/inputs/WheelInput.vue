<template>
  <div role="presentation" :class="`canvas-parent mx-auto ${classes}`">
    <canvas width="200" height="200" class="wheel" ref="canvas" :data-dummyvalue="redraw"></canvas>
  </div>
</template>

<script>
import BaseInput from './BaseInput.vue';

import { encodeAngle, decodeAngle } from '../../../../common/transform';

// prettier-ignore
const ARROW_BASE64_IMG_DOWN = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAA'
    + 'AAyCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAP9JREFUaIHt181qg0AYheG312hLAi102eS2G0'
    + 'oXzaJ0maZJFnpAZAyaOH/lPOBGHP1eRheCmZmZmdlMa+AHeAeazLOEPAIfwDfwNHbRA/AFnLvjCDy'
    + 'nmG6iF9qZNN+eduagfkhJMcOIM/B5bcEqsCB3TCjiyIRXvwEOg4UnYBNr0iu23bP7sxyY8f2WEHN3'
    + 'hOSMWSxCcsQsHiEpYzZEipAUMdEjJGZMsgiJEZM8QpaMyRYhYzFvM+6RPULuiSkmQm6JKS5C5sQUG'
    + 'yFTYoqPkFDMH/BKG1RFhIT+HX4D53L/40wS2plqdmJoLKaqCBnGVBkhDbDrjmojzMzMzOyfuADt1u'
    + '6qCjWuFwAAAABJRU5ErkJggg==';

// prettier-ignore
const ARROW_BASE64_IMG_UP = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAA'
    + 'yCAYAAAAeP4ixAAAABHNCSVQICAgIfAhkiAAAAPdJREFUaIHt171qwzAUhuE316iGFFroaPe2U0oH'
    + 'ZwgZXbfNEB9og5TGv0eC7wEtRjLnRZNARERERMRZAN76FZxnGS0ALfDTr5YCY64jioxJRRQV8wR0/'
    + 'B28Az4j356dZvxX7Ca+gQp4Ab4o4GZSEfWvPVX/LduYeyJMtjFDIkx2MWMiTDYxUyKMe8wcEabGKW'
    + 'bOCLN6zBIRZrWYJSPM4jFrRJjFYlIRr1N/fMPsMR4RZrYYzwgzOSaHCDM6JhB/T3i+HVJvnN2tQx+'
    + 'RAzk8gGIxTWrzBjiQX4S5jmm4zBy1BY7AO/CwxnQDBWAPnIBH51lEREREpDRnAC3uql0XROkAAAAASUVORK5CYII=';

const MAXRADIUS = 71;
const ORIGINX = 95;
const ORIGINY = 95;
const SHAPE_ORIGINY = 25;

const shapes = [
    {
        x: ORIGINX,
        y: SHAPE_ORIGINY,
        r: 10,
        fill: '#0c64e8'
    }
];

const circles = [
    // Outer circle
    {
        x: ORIGINX,
        y: ORIGINY,
        r: 70,
        fill: 'blue',
        lineWidth: 5
    }
];

export default {
    name: 'WheelInput',
    extends: BaseInput,
    props: {
        /**
         * Zoom gain.
         */
        zoomtransform: {
            type: Number,
            required: false,
            default: 5
        }
    },
    data() {
        return {
            dragOk: false,
            startX: 0,
            startY: 0,
            ctx: null,
            canvas: null,
            offsetX: 0,
            offsetY: 0
        };
    },
    computed: {
        redraw() {
            if (this.ctx) {
                this.unregisterEvents();

                shapes[0].x = ORIGINX;
                shapes[0].y = SHAPE_ORIGINY;

                const angle = decodeAngle(this.fieldValue ? this.fieldValue.angle || 0 : 0);

                if (angle !== 0) {
                    const x = Math.round(MAXRADIUS * Math.cos(angle));
                    const y = Math.round(MAXRADIUS * Math.sin(angle));
                    shapes[0].x = ORIGINX + x;
                    shapes[0].y = ORIGINY + y;
                }
                shapes[0].angle = angle;

                this.startRender();
            }

            return null;
        },

        zoomGain() {
            return this.zoomtransform;
        }
    },
    mounted() {
        const zoom = (this.fieldValue ? this.fieldValue.zoom || 0 : 0) / this.zoomGain;
        this.zoomLevel = parseFloat(zoom, 10);
        this.img1Loaded = false;
        this.imageDown = new Image();
        this.imageDown.onload = () => {
            this.img1Loaded = true;
            this.draw();
        };
        this.imageDown.src = ARROW_BASE64_IMG_DOWN;

        this.img2Loaded = false;
        this.imageUp = new Image();
        this.imageUp.onload = () => {
            this.img2Loaded = true;
            this.draw();
        };
        this.imageUp.src = ARROW_BASE64_IMG_UP;

        // Bind the corrct context and save function signatures.
        // Use these functions so that event removal also works correctly
        this.mouseDown = this.myDown.bind(this);
        this.mouseUp = this.myUp.bind(this);
        this.mouseMove = this.myMove.bind(this);

        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext('2d');
    },
    beforeDestroy() {
        this.unregisterEvents();
    },
    methods: {
        unregisterEvents() {
            this.canvas.removeEventListener('mousedown', this.mouseDown);
            this.canvas.removeEventListener('mouseup', this.mouseUp);
            this.canvas.removeEventListener('mousemove', this.mouseMove);
        },

        registerEvents() {
            this.canvas.addEventListener('mousedown', this.mouseDown);
            this.canvas.addEventListener('mouseup', this.mouseUp);
            this.canvas.addEventListener('mousemove', this.mouseMove);
        },

        circle(c) {
            this.ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
            this.ctx.beginPath();
            this.ctx.arc(c.x, c.y, c.r + 10, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.fillStyle = c.fill;
            this.ctx.beginPath();
            this.ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fill();
        },

        draw() {
            this.ctx.save();

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            circles.forEach(item => {
                this.ctx.beginPath();
                this.ctx.arc(item.x, item.y, item.r, 0, 2 * Math.PI);
                this.ctx.lineWidth = item.lineWidth;
                this.ctx.strokeStyle = item.fill;
                this.ctx.stroke();
            });

            // Up arrow
            if (this.img2Loaded) {
                this.ctx.drawImage(this.imageUp, 70, 40);
            }

            // Down arrow
            if (this.img1Loaded) {
                this.ctx.drawImage(this.imageDown, 70, 100);
            }

            // Current zoom level
            this.ctx.font = this.ctx.font.replace(/\d+px/, '16px');
            this.ctx.fillText(`Zoom ${this.zoomLevel}%`, 60, 100);

            // Draw the actual shape position
            this.circle(shapes[0]);

            this.ctx.restore();
        },

        myDown(e) {
            const rect = this.canvas.getBoundingClientRect();
            this.offsetX = rect.left;
            this.offsetY = rect.top;

            // Get the current mouse position
            const mx = parseInt(e.clientX - this.offsetX, 10);
            const my = parseInt(e.clientY - this.offsetY, 10);

            this.dragOk = false;

            // Test if mouse is inside the shape
            const s = shapes[0];
            const dx = s.x - mx;
            const dy = s.y - my;

            // Test if the mouse is inside this circle
            const r = Math.sqrt(dx * dx + dy * dy);
            if (r < s.r) {
                const angle = Math.atan2(dy, dx);
                const x = Math.round(10 * Math.cos(angle));
                const y = Math.round(10 * Math.sin(angle));

                this.dragOk = true;

                s.offsetX = x;
                s.offsetY = y;

                this.startX = mx;
                this.startY = my;
            }

            if (mx > 70 && mx < 120) {
                // Zoom level increase
                if (my > 50 && my < 70) {
                    this.updateZoom(10);
                }

                // Zoom level decrease
                if (my > 120 && my < 140) {
                    this.updateZoom(-10);
                }
            }
        },

        myUp() {
            if (this.dragOk) {
                this.dragOk = false;
                this.setValues(shapes[0]);
            }
        },

        myMove(e) {
            if (this.dragOk) {
                // Get the current mouse position
                const mx = parseInt(e.clientX - this.offsetX, 10) - shapes[0].offsetX;
                const my = parseInt(e.clientY - this.offsetY, 10) - shapes[0].offsetY;

                let dx2 = mx - ORIGINX;
                let dy2 = my - ORIGINY;
                const angle = Math.atan2(dy2, dx2);

                const cos = Math.cos(angle);
                const sin = Math.sin(angle);

                dx2 = Math.round(MAXRADIUS * cos);
                dy2 = Math.round(MAXRADIUS * sin);

                // New shape position on the circle
                const s = shapes[0];
                s.x = ORIGINX + dx2;
                s.y = ORIGINY + dy2;
                s.angle = angle;

                // Redraw the scene with the new positions
                this.draw();

                // Reset the starting mouse position for the next mousemove
                this.startX = dx2 + ORIGINX;
                this.startY = dy2 + ORIGINY;
            }
        },

        startRender() {
            // Mouse related event listeners
            this.registerEvents();

            // Draw the initial scene
            this.draw();
        },

        setValues(shape) {
            // Current distance and angle
            this.fieldValue = {
                zoom: this.zoomLevel * this.zoomGain,
                angle: encodeAngle(shape.angle)
            };

            // Emit the values to parent
            this.inputChangeEvent();
        },

        updateZoom(delta) {
            this.zoomLevel += delta;
            if (this.zoomLevel < 0) {
                this.zoomLevel = 100;
            }

            if (this.zoomLevel > 100) {
                this.zoomLevel = 0;
            }

            this.zoomLevel = parseFloat(this.zoomLevel.toFixed(3), 10);
            this.setValues(shapes[0]);
            this.draw();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.canvas-parent {
    position: relative;
    user-select: none;
    width: 200px;
    height: 200px;
}
.wheel {
    padding: 0px;
    margin: 0px;
    border: 0px;
    background: transparent;
    position: absolute;
    top: 20px;
    left: 0px;
    display: block;
}
</style>
