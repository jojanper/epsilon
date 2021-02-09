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

    <div class="row p-4">
      <draal-import
        class="mx-auto w-75"
        label="My exported audio"
        data-key="name"
        tooltip-text="Export audio meta"
        icon-color="red darken-2"
        icon-size="large"
        @data-select="setAudioMetaData"
        @data-error="errorData"
      ></draal-import>
    </div>

    <div v-if="files.length" class="w-75 mx-auto">
      <draal-export v-if="exportFiles.length" :url="playlistExport" name="Playlist_export.json">
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
import { peaks } from './peaks';

import DraalFileImport from '@/components/core/utils/FileImport.vue';
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';
import DraalExpandItem from '@/components/core/utils/ExpandItem.vue';
import DraalExport from '@/components/core/utils/Export.vue';
import DraalImport from '@/components/core/Import.vue';
import DraalAudioPlayer from '@/components/core/AudioPlayer.vue';
import {
    getMediaDuration, BaseObservableObject, serializeObject, urlObject4Json
} from '@/common/utils';

export default {
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
                    icon: 'mdi-file-export',
                    iconSize: 'medium'
                },
                editTooltip: 'Click to edit the export name',
                editLabel: 'Export data name'
            },
            files: [],
            playerActivator: BaseObservableObject.createAsSubject(),
            playlistExport: null
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
            this.exportPlaylist();
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
