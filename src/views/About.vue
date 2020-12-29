<template>
  <div class="about">
    <h1>This is an about page</h1>
    <draal-nested-view class="w-25" :nodes="list"></draal-nested-view>

    <canvas width="1000" height="200" ref="canvas"></canvas>
  </div>
</template>

<script>
import DraalNestedView from './Nested.vue';

import { peaks } from './peaks';

export default {
    components: { DraalNestedView },
    data() {
        return {
            list: [
                {
                    text: 'Foo',
                    active: false,
                    children: [
                        {
                            text: 'A',
                            active: false
                        },
                        {
                            text: 'B',
                            active: false
                        },
                        {
                            text: 'C',
                            active: false,
                            children: [
                                {
                                    text: 'A',
                                    active: false
                                }
                            ]
                        }
                    ]
                },
                {
                    text: 'Bar',
                    active: false
                },
                {
                    text: 'FooBar',
                    active: false
                },
                {
                    text: 'BarFoo',
                    active: false
                }
            ]
        };
    },
    mounted() {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const first = 0;
        const absmaxHalf = 0.015625;
        const canvasStart = 0;
        const canvasEnd = 1742;
        const scale = 0.5;
        const halfOffset = 64;

        this.halfPixel = 0.5;

        this.ctx.beginPath();
        this.ctx.fillStyle = 'violet';
        this.ctx.moveTo((canvasStart - first) * scale, halfOffset);

        let i;
        for (i = canvasStart; i < canvasEnd; i++) {
            const peak = peaks[2 * i] || 0;
            const h = Math.round(peak / absmaxHalf);
            console.log((i - first) * scale + this.halfPixel, halfOffset - h);
            this.ctx.lineTo((i - first) * scale /*+ this.halfPixel*/, halfOffset - h);
        }

        // draw the bottom edge going backwards, to make a single
        // closed hull to fill
        let j = canvasEnd - 1;
        for (j; j >= canvasStart; j--) {
            const peak = peaks[2 * j + 1] || 0;
            const h = Math.round(peak / absmaxHalf);
            //console.log((j - first) * scale + this.halfPixel, halfOffset - h);
            this.ctx.lineTo((j - first) * scale + 1 * this.halfPixel, halfOffset - h);
        }

        //this.ctx.restore();
        this.ctx.closePath();
        this.ctx.fill();
    }
};
</script>
