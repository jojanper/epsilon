<template>
  <div>
    <!--div class="mx-auto" style="width: 1000px; overflow-x: scroll; "-->
    <!--canvas height="256" width="4099" ref="canvas"></canvas-->
    <div style="overflow:auto">
      <canvas ref="canvas"></canvas>
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
import DraalExport from '@/components/core/utils/Export.vue';
import DraalImport from '@/components/core/Import.vue';
import DraalAudioPlayer from '@/components/core/AudioPlayer.vue';
import {
    getMediaDuration, BaseObservableObject, serializeObject, urlObject4Json
} from '@/common/utils';

const MP3 = 'http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3';

export default {
    name: 'DraalAppAudioHome',
    components: {
        DraalFileImport,
        DraalIconDialog,
        DraalExpandItem,
        DraalAudioPlayer,
        DraalExport,
        DraalImport
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
            ]
        };
    },
    destroyed() {
        this.playerActivator.close();
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
                    console.log(data);
                    // console.log(data.getChannelData(0));

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
            this.exportPlaylist();
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
            const chunkSize = 180;

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

            this.drawWaveform(minPeaks, maxPeaks, 1, minPeaks[0].length);
        },

        drawWaveform(minPeaks, maxPeaks, numberOfChannels, numPeaks) {
            const { canvas } = this.$refs;

            this.ctx = canvas.getContext('2d');

            // this.ctx.canvas.width = 4050;// numPeaks;

            console.log(canvas.width, numPeaks);

            canvas.height = 256;
            // canvas.style.height = `${canvas.height}px`;
            canvas.width = numPeaks;
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

            const { width } = canvas;

            const offsetX = 0;
            // if (offsetX > waveform.length - canvas.width) {
            // offsetX = waveform.length - canvas.width;
            // }

            const waveformHeight = canvas.height; // / waveform.channels;

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
                for (x = 0, i = offsetX; x < width && i < numPeaks; x++, i++) {
                    const val = audioPeaks[i];
                    // console.log(x, val);
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
