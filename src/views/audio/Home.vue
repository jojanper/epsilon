<template>
  <div>
    <canvas width="1500" height="400" ref="canvas"></canvas>

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
          v-model="file.state"
          @delete="deleteItem(index)"
        >
          <div slot="content" class="p-4">
            <draal-audio-player
              :activator="playerActivator"
              :active-id="file.$id"
              :name="file.url"
              :url="file.url"
              :init-activate="index === 0 ? true : false"
            ></draal-audio-player>
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
import DraalFileImport from '@/components/core/utils/FileImport.vue';
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';
import DraalExpandItem from '@/components/core/utils/ExpandItem.vue';
import DraalAudioPlayer from '@/components/core/AudioPlayer.vue';
import { getMediaDuration, BaseObservableObject } from '@/common/utils';

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
            files: [],
            playerActivator: BaseObservableObject.createAsSubject()
        };
    },
    destroyed() {
        this.playerActivator.close();
    },
    mounted() {
        this.canvas = this.$refs.canvas;
    },
    methods: {
        fileSelect(files) {
            const $id = Date.now();

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

                    const audio = [];
                    for (let ch = 0; ch < data.numberOfChannels; ch++) {
                        audio.push(data.getChannelData(ch));
                    }

                    this.audioPeaks({
                        length: data.length,
                        numberOfChannels: data.numberOfChannels,
                        data: audio
                    });
                },
                console.log
            );
        },

        deleteItem(index) {
            URL.revokeObjectURL(this.files[index].url);
            this.files.splice(index, 1);
        },

        calculateAudioDataLength(nSamples, scale) {
            let dataLength = Math.floor(nSamples / scale);
            const remaining = nSamples - (dataLength * scale);
            if (remaining > 0) {
                dataLength += 1;
            }

            return dataLength;
        },

        audioPeaks({ data, length, numberOfChannels }) {
            const INT8_MAX = 127;
            const INT8_MIN = -128;
            const scale = 1.0;
            const chunkSize = 512;

            const minPeaks = [[], []];
            const maxPeaks = [[], []];
            const minVal = new Array(numberOfChannels);
            const maxVal = new Array(numberOfChannels);

            for (let channel = 0; channel < numberOfChannels; channel++) {
                minVal[channel] = Infinity;
                maxVal[channel] = -Infinity;
            }

            let counter = 0;
            for (let i = 0; i < length; i++) {
                for (let ch = 0; ch < numberOfChannels; ch++) {
                    const sample = Math.floor(INT8_MAX * data[ch][i] * scale);

                    if (sample < minVal[ch]) {
                        minVal[ch] = sample;

                        if (minVal[ch] < INT8_MIN) {
                            minVal[ch] = INT8_MIN;
                        }
                    }

                    if (sample > maxVal[ch]) {
                        maxVal[ch] = sample;

                        if (maxVal[ch] > INT8_MAX) {
                            maxVal[ch] = INT8_MAX;
                        }
                    }
                }

                counter += 1;
                if (counter === chunkSize) {
                    for (let ch = 0; ch < numberOfChannels; ch++) {
                        minPeaks[ch].push(minVal[ch]);
                        maxPeaks[ch].push(maxVal[ch]);
                        minVal[ch] = Infinity;
                        maxVal[ch] = -Infinity;
                    }

                    counter = 0;
                }
            }

            if (counter > 0) {
                for (let ch = 0; ch < numberOfChannels; ch++) {
                    minPeaks[ch].push(minVal[ch]);
                    maxPeaks[ch].push(maxVal[ch]);
                }
            }

            // console.log(minPeaks[0]);
            // console.log(maxPeaks[0]);

            this.drawWaveform(minPeaks, maxPeaks, 1, minPeaks[0].length);
        },

        drawWaveform(minPeaks, maxPeaks, numberOfChannels, numPeaks) {
            this.ctx = this.canvas.getContext('2d');
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'violet';

            const { width } = this.canvas;

            const offsetX = 0;
            /*
            if (offsetX > waveform.length - canvas.width) {
                offsetX = waveform.length - canvas.width;
            }
            */

            const waveformHeight = this.canvas.height; // / waveform.channels;

            console.log(waveformHeight, width, numPeaks);

            const scaleY = (amplitude, height) => {
                const range = 384;
                const offset = 192;
                return height - ((amplitude + offset) * height) / range;
            };

            for (let c = 0, offsetY = 0; c < numberOfChannels; c++) {
                let x;
                let i;

                this.ctx.beginPath();

                let audioPeaks = maxPeaks[c];

                // eslint-disable-next-line no-plusplus
                for (x = 0, i = offsetX; x < width && i < numPeaks; x++, i++) {
                    const val = audioPeaks[i];
                    // console.log(x + 0.5, offsetY + scaleY(val, waveformHeight) + 0.5);
                    this.ctx.lineTo(x + 0.5, offsetY + scaleY(val, waveformHeight) + 0.5);
                }

                console.log('x', x);

                audioPeaks = minPeaks[c];

                // x = canvas.width - 1
                // eslint-disable-next-line no-plusplus
                for (x = width - 1, i = offsetX + width - 1; x >= 0; x--, i--) {
                    const val = audioPeaks[i];
                    this.ctx.lineTo(x + 0.5, offsetY + scaleY(val, waveformHeight) + 0.5);
                }

                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            }
        }
    }
};
</script>
