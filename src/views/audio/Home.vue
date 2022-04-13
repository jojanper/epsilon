<template>
  <div class="m-3">
    <!--div class="mx-auto" style="width: 1000px; overflow-x: scroll; "-->
    <!--canvas height="256" width="4099" ref="canvas"></canvas-->

    <div class="p-2 border rounded elevation-3">
      <draal-tooltip
        name="Zoom-out"
        icon="mdi-magnify-minus-outline"
        @clicked="handleZoom(-1)"
      ></draal-tooltip>
      <draal-tooltip
        name="Zoom-in"
        icon="mdi-magnify-plus-outline"
        @clicked="handleZoom(1)"
      ></draal-tooltip>
      <draal-tooltip
        name="Zoom via scroll"
        icon="mdi-magnify-scan"
        @scroll="handleScroll"
      ></draal-tooltip>
    </div>

    <div
      v-show="audioData"
      class="mt-3"
      style="overflow:auto;"
      @wheel.prevent="handleWheel"
      ref="timeline"
    >
      <div style="position: relative; height: 320px;">
        <canvas
          ref="canvas"
          style="position: absolute; left: 0; top: 0; z-index: 0;"
        ></canvas>
        <canvas
          ref="playpos"
          style2="border: 1px solid black;"
          style="position: absolute; left: 0; top: 0; z-index: 1;"
        ></canvas>
      </div>
    </div>
    <!--/div-->

    <div class="row p-4 clearfix">
      <draal-file-import
        class="mx-auto"
        tooltip-text="Import file"
        icon-color="blue"
        icon="mdi-folder-open"
        @file-select="fileSelect"
      ></draal-file-import>
    </div>

    <div class="row p-4">
      <draal-import
        class="mx-auto w-75"
        label="My exported audio"
        data-key="name"
        tooltip-text="Import audio meta"
        icon-color="blue darken-2"
        icon-size="large"
        :data="importData"
        @data-select="setAudioMetaData"
        @data-error="errorData"
        @data-array="setImportData"
      ></draal-import>
    </div>

    <div
      v-if="files.length"
      class="w-75 mx-auto"
    >
      <draal-export
        v-if="exportFiles.length"
        :url="playlistExport"
        name="Playlist_export.json"
      >
        <v-btn color="primary">Export audio playlist</v-btn>
      </draal-export>
      <div
        class="audio-playlist border p-2 m-2 elevation-1"
        v-for="(file, index) in files"
        :key="file.$id"
      >
        <draal-expand-item
          :delete-action-attrs="toolbar.deleteAction"
          :export-action-attrs="toolbar.exportAction"
          :edit-tooltip="toolbar.editTooltip"
          :edit-label="toolbar.editLabel"
          :title="file.title"
          :custom-actions="1"
          v-model="file.state"
          @delete="deleteItem(index)"
          @export="status => setExportItem(index, status)"
          @export-name="name => setExportName(index, name)"
          @edit="exportEditing"
        >
          <div
            slot="content"
            class="p-4"
          >
            <draal-audio-player
              :activator="playerActivator"
              :active-id="file.$id"
              :name="file.url"
              :url="file.url"
              :init-activate="index === 0 ? true : false"
              @audio-position="audioPlayPosition"
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

    <draal-audio-player
      class="p-3 mb-4 w-75 mx-auto elevation-2"
      :name="url"
      :url="url"
      :events="eventPos"
    >
      <template v-slot:item="{ event }">Position: {{ event }}s</template>
    </draal-audio-player>
  </div>
</template>

<script>
import DraalFileImport from '@/components/core/utils/FileImport.vue';
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';
import DraalExpandItem from '@/components/core/utils/ExpandItem.vue';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';
import DraalExport from '@/components/core/utils/Export.vue';
import DraalImport from '@/components/core/Import.vue';
import DraalAudioPlayer from '@/components/core/AudioPlayer.vue';
import {
    getMediaDuration, BaseObservableObject, serializeObject, urlObject4Json, debounce
} from '@/common/utils';

const MP3 = 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3';

/**
 * Grid:
 * 10ms  :   1ms step
 * 50ms  :  10ms step
 * 100ms :  50ms step
 * 500ms : 100ms step
 * 1s    :  0,5s step
 * 5s    :    1s step
 * 10s   :    5s step
 * 30s   :   10s step
 * 1min  :   30s step
 * 5min  :  1min step
 *
 * On initial render, determine optimal step size.
 *  - Get window/element width
 *
 * Draw audio timeline
 */

const TIMEAXIS = [
    {
        grid: 0.1,
        step: 0.05,
        gain: 0.1
    },
    {
        grid: 0.5,
        step: 0.1,
        gain: 0.2
    },
    {
        grid: 1,
        step: 0.5,
        gain: 1
    },
    {
        grid: 5,
        step: 1,
        gain: 2
    },
    {
        grid: 10,
        step: 5,
        gain: 10
    },
    {
        grid: 30,
        step: 10,
        gain: 20
    },
    {
        grid: 60,
        step: 30,
        gain: 60
    },
    {
        grid: 300,
        step: 60,
        gain: 120
    }
];

export default {
    name: 'DraalAppAudioHome',
    components: {
        DraalFileImport,
        DraalIconDialog,
        DraalExpandItem,
        DraalAudioPlayer,
        DraalExport,
        DraalImport,
        DraalTooltip
    },
    data() {
        return {
            show: false,

            dialog: false,

            toolbar: {
                deleteAction: {
                    name: this.$t('audioPage.deleteItem'),
                    iconSize: 'medium'
                },
                exportAction: {
                    name: this.$t('audioPage.exportItem'),
                    icon: 'mdi-export',
                    iconSize: 'medium'
                },
                editTooltip: 'Click to edit the export name',
                editLabel: 'Export data name'
            },
            files: [],
            playerActivator: BaseObservableObject.createAsSubject(),
            playlistExport: null,

            importData: [],

            url: MP3,
            eventPos: [
                0.5,
                2,
                10,
                70,
                45
            ],

            audioData: null,
            zoomLevel: TIMEAXIS.length - 1,
            chunkSize: 512
        };
    },
    destroyed() {
        this.playerActivator.close();
    },
    created() {
        this.renderAudio = debounce(this.renderAudioZoom, 250);
    },
    mounted() {
        // Store currently active player ID to handle editing of audio titles.
        // Player keyboard handling is deactivated when editing of audio titles occurs.
        // And activates once editing ends.
        this.playerId = null;
        this.playerActivator.asPipe().subscribe(data => {
            if (data !== null) {
                this.playerId = data;
            }
        });

        this.canvas = this.$refs.canvas;
        this.playpos = this.$refs.playpos;
    },
    computed: {
        exportFiles() {
            return this.files.filter(file => file.export);
        }
    },
    methods: {
        errorData(err) {
            console.log(err);
        },

        setAudioMetaData(data) {
            console.log(data);
        },

        fileSelect(files) {
            const $id = Date.now();

            this.files.forEach(item => {
                /* eslint-disable-next-line no-param-reassign */
                item.state = false;
            });

            this.files.unshift({
                state: true,
                title: files[0].name,
                name: files[0].name,
                url: URL.createObjectURL(files[0]),
                $id,
                export: false
            });

            getMediaDuration(
                files[0],
                data => {
                    this.audioData = data;

                    console.log(data);
                    // console.log(data.getChannelData(0));

                    this.renderAudioZoom();

                    /*
                    const audio = [];
                    for (let ch = 0; ch < data.numberOfChannels; ch++) {
                        audio.push(data.getChannelData(ch));
                    }

                    this.audioPeaks({
                        length: data.length,
                        numberOfChannels: data.numberOfChannels,
                        data: audio,
                        chunkSize: this.chunkSize
                    });
                    */
                },
                console.log
            );
        },

        deleteItem(index) {
            URL.revokeObjectURL(this.files[index].url);
            this.files.splice(index, 1);
            this.exportPlaylist();
        },

        getDisplayTime(time) {
            let timeSec = time;

            let hours = Math.floor(timeSec / 3600);
            timeSec = time - hours * 3600;
            let minutes = Math.floor(timeSec / 60);

            // As we are rounding the seconds, make sure to it stays valid value
            let seconds = parseInt((timeSec % 60).toFixed(0), 10);
            if (seconds === 60) {
                seconds = 0;
                minutes += 1;
            }

            // Minutes was increased to full minute -> increase hours instead
            if (minutes === 60) {
                minutes = 0;
                hours += 1;
            }

            const hh = (hours < 10) ? `0${hours}` : hours;
            const mm = (minutes < 10) ? `0${minutes}` : minutes;
            const ss = (seconds < 10) ? `0${seconds}` : `${seconds}`;

            return hours === 0 ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;
        },

        audioPlayPosition(pos) {
            // console.log(pos);

            // Avoid floating-point coordinates and use integers instead

            const { canvas, playpos } = this.$refs;

            playpos.width = canvas.width;
            playpos.height = canvas.height;

            const ctx = playpos.getContext('2d');

            const normPos = pos / this.audioData.duration;

            const width = playpos.width - 6;
            const waveformHeight = playpos.height - 64; // / waveform.channels;

            const timePos = 4 + width * normPos;

            console.log(normPos, pos, this.audioData.duration, playpos.width, playpos.height, timePos);

            ctx.clearRect(0, 0, playpos.width, playpos.height);

            ctx.strokeStyle = 'grey';
            ctx.beginPath();
            ctx.lineTo(timePos, 0);
            ctx.lineTo(timePos, waveformHeight);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        },

        calculateAudioDataLength(nSamples, scale) {
            let dataLength = Math.floor(nSamples / scale);
            const remaining = nSamples - (dataLength * scale);
            if (remaining > 0) {
                dataLength += 1;
            }

            return dataLength;
        },

        audioPeaks({
            data, length, numberOfChannels, chunkSize
        }) {
            const INT8_MAX = 127;
            const INT8_MIN = -128;
            const scale = 1.0;

            const minPeaks = [[], []];
            const maxPeaks = [[], []];
            const minVal = new Array(numberOfChannels);
            const maxVal = new Array(numberOfChannels);

            console.log(numberOfChannels);

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

            console.log('CHUNK', chunkSize, length, length / chunkSize, minPeaks[0].length);

            this.drawWaveform(minPeaks, maxPeaks, 1, minPeaks[0].length);
        },

        drawWaveform(minPeaks, maxPeaks, numberOfChannels, numPeaks) {
            const { canvas } = this.$refs;

            this.ctx = canvas.getContext('2d');

            // this.ctx.canvas.width = 4050;// numPeaks;

            console.log('CANVAS WIDTH', canvas.width, numPeaks);

            canvas.height = 320;
            // canvas.style.height = `${canvas.height}px`;
            canvas.width = numPeaks + 5;
            // canvas.style.width = `${canvas.width}px`;

            this.ctx.save();

            // const scale = 1.5;
            // this.ctx.setTransform(scale, 0, 0, scale, 0, 0);

            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.fillStyle = 'violet';

            /*
            this.ctx.fillText('Zoom', 60, 100);

            function square(ctx, pos) {
                ctx.beginPath();
                ctx.moveTo(pos, 0);
                ctx.lineTo(pos, 18);
                ctx.lineTo(pos + 10.5, 18);
                ctx.lineTo(pos + 10.5, 0);
                ctx.lineTo(pos, 0);
                ctx.fill();
            }

            square(this.ctx, 170);
            // square(this.ctx, 200);
            */

            const width = canvas.width - 6;

            const offsetX = 0;
            // if (offsetX > waveform.length - canvas.width) {
            // offsetX = waveform.length - canvas.width;
            // }

            const waveformHeight = canvas.height - 64; // / waveform.channels;

            console.log(waveformHeight, width, numPeaks, canvas, canvas.width, canvas.height);

            const scaleY = (amplitude, height) => {
                const range = 256;
                const offset = 128;
                return height - ((amplitude + offset) * height) / range;
            };

            for (let c = 0, offsetY = 0; c < numberOfChannels; c++) {
                let x;
                let i;

                this.ctx.beginPath();

                let audioPeaks = maxPeaks[c];

                // eslint-disable-next-line no-plusplus
                // for (x = 0, i = offsetX; x < width && i < numPeaks ; x++, i++) {
                // eslint-disable-next-line no-plusplus
                for (x = 5, i = offsetX; x < width && i < numPeaks; x++, i++) {
                    const val = audioPeaks[i];
                    // console.log(x, val);
                    // console.log(x + 0.5, offsetY + scaleY(val, waveformHeight) + 0.5);
                    this.ctx.lineTo(x + 0.5, offsetY + scaleY(val, waveformHeight) + 0.5);
                }

                console.log('x', x);

                audioPeaks = minPeaks[c];

                // x = canvas.width - 1
                // eslint-disable-next-line no-plusplus
                for (x = width - 1 + 5, i = offsetX + width - 1; x >= 0; x--, i--) {
                    const val = audioPeaks[i];
                    this.ctx.lineTo(x + 0.5, offsetY + scaleY(val, waveformHeight) + 0.5);
                }

                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fill();
            }

            /*
            this.ctx.strokeStyle = 'blue';
            this.ctx.beginPath();
            this.ctx.lineTo(100, 0);
            this.ctx.lineTo(100, waveformHeight);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fill();
            */

            const axis = this.getTimeAxis();
            const inc = width / this.audioData.duration;

            const axisData = [];

            console.log('WIDTH', canvas.width, width, inc);

            // let pos = 0;
            let offset = 5;
            for (let i = 0; i < axis.length; i++) {
                offset = 5 + axis[i].pos2 * inc;
                axisData.push({ pos: axis[i].pos, offset });
                console.log(offset, axis[i].pos2, inc, axis[i].pos2 * inc);
            }

            console.log(axisData);

            const markerHeight = 20;

            this.ctx.strokeStyle = 'grey';
            this.ctx.fillStyle = 'grey';

            for (let i = 0; i < axisData.length; i++) {
                const start = axisData[i].offset;
                const label = this.getDisplayTime(axisData[i].pos.toString());

                this.ctx.beginPath();
                this.ctx.lineTo(start, 260);
                this.ctx.lineTo(start, 260 + markerHeight);
                this.ctx.closePath();
                this.ctx.stroke();

                const labelWidth = this.ctx.measureText(label).width;
                this.ctx.fillText(label, start - labelWidth / 2, 320 - 1 - markerHeight);
            }

            // console.log(canvas.height, labelWidth);

            this.ctx.restore();
        },

        setExportItem(index, status) {
            this.files[index].export = status;
            this.exportPlaylist();
        },

        setExportName(index, name) {
            this.files[index].name = name;
            this.exportPlaylist();
        },

        exportPlaylist() {
            URL.revokeObjectURL(this.playlistExport);
            this.playlistExport = urlObject4Json(serializeObject(this.exportFiles, ['title', 'name']));
        },

        exportEditing(status) {
            const val = (!status) ? this.playerId : null;
            this.playerActivator.send(val);
        },

        setImportData(data) {
            this.importData.splice(0, this.importData.length);
            data.forEach(item => this.importData.push(item));
        },

        renderAudioZoom() {
            const audio = [];
            for (let ch = 0; ch < this.audioData.numberOfChannels; ch++) {
                audio.push(this.audioData.getChannelData(ch));
            }

            console.log(
                'NUMBER OF CHUNKS',
                this.audioData.length / (this.chunkSize * TIMEAXIS[this.zoomLevel].gain)
            );

            this.audioPeaks({
                length: this.audioData.length,
                numberOfChannels: this.audioData.numberOfChannels,
                data: audio,
                chunkSize: Math.floor(this.chunkSize * TIMEAXIS[this.zoomLevel].gain)
            });
        },

        handleWheel(data) {
            console.log('WHEEL');
            this.$refs.timeline.scrollBy({
                left: data.deltaY < 0 ? -30 : 30
            });
        },

        handleScroll(data) {
            if (data.deltaY < 0) {
                this.handleZoom(1);
            } else if (data.deltaY > 0) {
                this.handleZoom(-1);
            }
        },

        handleZoom(inc) {
            this.zoomLevel += inc;
            if (this.zoomLevel < 0) {
                this.zoomLevel = 0;
            } else if (this.zoomLevel > TIMEAXIS.length - 1) {
                this.zoomLevel = TIMEAXIS.length - 1;
            }

            this.renderAudio();
        },

        getTimeAxis() {
            const { duration } = this.audioData;
            console.log(duration);

            const step = TIMEAXIS[this.zoomLevel].grid;
            const inc = Math.floor(duration / step);

            console.log(inc, duration - step * inc);

            const axisData = [];

            let offset = 0;
            while (offset < duration) {
                axisData.push({
                    pos: offset,
                    pos2: offset
                });

                offset += step;
            }

            if (offset > duration) {
                axisData.push({
                    pos: '',
                    pos2: duration
                });
            }

            console.log(axisData);

            return axisData;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.audio-playlist {
    .expand-title {
        margin-top: 8px !important;
        margin-bottom: 8px !important;
    }
}
</style>
