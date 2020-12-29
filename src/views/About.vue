<template>
  <div class="about">
    <h1>This is an about page</h1>
    <draal-nested-view class="w-25" :nodes="list"></draal-nested-view>

    <canvas width="1000" height="400" ref="canvas"></canvas>

    <draal-file-dialog color="blue" icon="mdi-folder-open" @file-select="fileSelect"></draal-file-dialog>
  </div>
</template>

<script>
import DraalNestedView from './Nested.vue';
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';

import { peaks } from './peaks';
import { getMediaDuration } from '@/common/utils';

export default {
    components: {
        DraalNestedView,
        DraalFileDialog
    },
    data() {
        return {
            fileDialog: false,
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
        const absmaxHalf = 0.125 * 0.015625; // 0.015625;
        const canvasStart = 0;
        const canvasEnd = 1742;
        const scale = 1.0;
        const halfOffset = 200;

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
    },
    methods: {
        fileSelect(files) {
            console.log('selected', files);

            getMediaDuration(
                files[0],
                data => {
                    console.log(data);
                    console.log(data.getChannelData(0));
                },
                err => {
                    console.log(err);
                }
            );
        }
    }
};
</script>
