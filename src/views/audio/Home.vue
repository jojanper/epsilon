<template>
  <div>
    <div class="row pb-8 pt-4">
      <draal-file-import
        class="mx-auto"
        tooltip-text="Import audio file"
        tooltip-position="right"
        icon-color="blue darken-2"
        icon="mdi-folder-open"
        @file-select="fileSelect"
        :multiple="true"
      ></draal-file-import>
    </div>

    <canvas width="1000" height="400" ref="canvas"></canvas>
  </div>
</template>

<script>
import { peaks } from './peaks';

import DraalFileImport from '@/components/core/utils/FileImport.vue';
import { getMediaDuration } from '@/common/utils';

export default {
    components: {
        DraalFileImport
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
        // this.ctx.moveTo((canvasStart - first) * scale, halfOffset);

        let i;
        for (i = canvasStart; i < canvasEnd; i++) {
            const peak = peaks[2 * i] || 0;
            const h = Math.round(peak / absmaxHalf);
            console.log((i - first) * scale + this.halfPixel, halfOffset - h);
            this.ctx.lineTo((i - first) * scale /* + this.halfPixel */, halfOffset - h);
        }

        // draw the bottom edge going backwards, to make a single
        // closed hull to fill
        let j = canvasEnd - 1;
        for (j; j >= canvasStart; j--) {
            const peak = peaks[2 * j + 1] || 0;
            const h = Math.round(peak / absmaxHalf);
            // console.log((j - first) * scale + this.halfPixel, halfOffset - h);
            this.ctx.lineTo((j - first) * scale + 1 * this.halfPixel, halfOffset - h);
        }

        // this.ctx.restore();
        this.ctx.closePath();
        this.ctx.fill();
    },
    methods: {
        fileSelect(files) {
            getMediaDuration(
                files[0],
                data => {
                    console.log(data);
                    console.log(data.getChannelData(0));
                },
                console.log
            );
        }
    }
};
</script>
