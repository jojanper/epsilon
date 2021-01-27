<template>
  <div>
    <canvas width="1000" height="400" ref="canvas"></canvas>

    <div class="row p-4 clearfix">
      <draal-file-import
        class="mx-auto"
        tooltip-text="Import file"
        icon-color="blue"
        icon="mdi-folder-open"
        @file-select="fileSelect"
      ></draal-file-import>
    </div>

    <div class="w-75 mx-auto">
      <div class="border p-2 m-2 elevation-1" v-for="(file, index) in files" :key="file.$id">
        <draal-expand-item
          :deleteActionAttrs="toolbar.deleteAction"
          :title="file.title"
          :custom-actions="1"
          icon-size="large"
          :open-state="file.state"
          @delete="deleteItem(index)"
        >
          <div slot="content" class="p-4">
            <draal-audio-player :name="file.url" :url="file.url"></draal-audio-player>
          </div>
          <template slot="action-0">
            <draal-icon-dialog
              :tooltip-config="{ position: 'top', 'icon-size': 'medium', 'open-delay': '500', 'close-delay': '250' }"
              tooltip-text="Icon tooltip"
              :dialog-title="`This is title ${index}`"
              dialog-content="This is content"
            ></draal-icon-dialog>
          </template>
        </draal-expand-item>
      </div>
    </div>
  </div>
</template>

<script>
import { peaks } from './peaks';

import DraalFileImport from '@/components/core/utils/FileImport.vue';
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';
import DraalExpandItem from '@/components/core/utils/ExpandItem.vue';
import DraalAudioPlayer from '@/components/core/AudioPlayer.vue';
import { getMediaDuration } from '@/common/utils';

export default {
    components: {
        DraalFileImport,
        DraalIconDialog,
        DraalExpandItem,
        DraalAudioPlayer
    },
    data() {
        return {
            show: false,

            dialog: false,

            toolbar: {
                deleteAction: {
                    name: 'Delete',
                    iconSize: 'medium'
                }
            },
            files: []
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
            const $id = Date.now();

            console.log(files[0]);
            this.files.forEach(item => {
                /* eslint-disable-next-line no-param-reassign */
                item.state = false;
            });
            this.files.unshift({
                state: true,
                title: files[0].name,
                url: URL.createObjectURL(files[0]),
                $id
            });

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
        },

        deleteItem(index) {
            URL.revokeObjectURL(this.files[index].url);
            this.files.splice(index, 1);
        }
    }
};
</script>
