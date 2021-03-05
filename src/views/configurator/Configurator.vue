<template>
  <div>
    <h1>{{ $t('configuratorPage.title') }}</h1>

    <draal-form-generator
      :schema="schema1"
      v-model="formData1"
      v-on:submit="submit"
      :options="options"
    ></draal-form-generator>

    <v-expansion-panels
      class="mt-3 mb-3"
      v-model="activePanel"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>{{ $t('configuratorPage.confPanelTitle') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <draal-file-import
            class="mb-6"
            tooltip-text="Import JSON"
            tooltip-position="right"
            icon-color="red darken-2"
            icon="mdi-import"
            @file-select="fileSelect"
            :multiple="true"
          ></draal-file-import>

          <draal-form-generator
            :schema="schema"
            v-model="formData"
            v-on:submit="encode"
            :options="options"
            :reset="resetField"
          >
            <template v-slot:form.row.timeline2.angleDir="{ data }">
              <v-icon :style="renderAzimuth(data)">mdi-arrow-up</v-icon>
            </template>

            <template v-slot:form.row.timeline2.edit-dialog>
              <v-icon>mdi-arrow-down</v-icon>
            </template>

            <!-- Handle timeline event data editing -->
            <template v-slot:form.timeline.edit-dialog="{ data  }">
              <draal-event-data-edit
                :key="data.source.$id"
                :data="data.source"
                :save="data.save"
              ></draal-event-data-edit>
            </template>

            <!-- Handle timeline event data rendering in the table -->
            <template v-slot:form.timeline.value="{ data }">
              <draal-event-data :data="data"></draal-event-data>
            </template>

            <!-- Create toolbar on the left side of the timeline -->
            <template v-slot:form.timeline.toolbar-left="{ data }">
              <div>
                <!-- Timeline toolbar icons -->
                <draal-tooltip
                  v-for="(event, index) in timelineToolbarIcons"
                  :key="index"
                  classes="ml-2"
                  v-bind="toolIconAttrs"
                  :name="event.name"
                  :icon="event.icon"
                  @clicked="iconClick(data, event.value)"
                ></draal-tooltip>
                <!-- Timeline toolbar dropdown menu -->
                <draal-tooltip-menu
                  v-if="menuPresets.length > 0"
                  tooltip-text="More event presets"
                  :tooltip-attrs="{ position: toolIconAttrs.position }"
                  :menuItems="menuPresets"
                  :cb-data="data"
                  :menuAttrs="{ left: true, 'offset-y': true }"
                >
                  <template v-slot:menu-entry="{ menu, tooltip }">
                    <v-icon
                      class="float-right"
                      v-bind="menuAttrs"
                      v-on="{ ...menu, ...tooltip}"
                    >mdi-menu</v-icon>
                  </template>
                </draal-tooltip-menu>
              </div>
            </template>

            <!-- Customize toolbar on the right side of the timeline -->
            <template v-slot:form.timeline.toolbar-right.add="{ data }">
              <!-- Add new direction event -->
              <draal-tooltip
                v-bind="toolIconAttrs"
                :name="$t('configuratorPage.newDirection')"
                icon="mdi-focus-field"
                @clicked="addEvent(data, timelineTypes.dir)"
              ></draal-tooltip>
              <!-- Add new switch event -->
              <draal-tooltip
                v-bind="toolIconAttrs"
                :name="$t('configuratorPage.newSwitch')"
                icon="mdi-fan"
                @clicked="addEvent(data, timelineTypes.switch)"
              ></draal-tooltip>
            </template>
          </draal-form-generator>

          <div class="row">
            <draal-file-import
              tooltip-text="Open"
              class="col-sm"
              icon-color="blue"
              icon="mdi-folder-open"
              @file-select="fileSelect"
            ></draal-file-import>

            <draal-file-import
              tooltip-text="Open multiple files"
              class="col-sm"
              icon-color="blue"
              icon="mdi-plus"
              :drag="false"
              :multiple="true"
              @file-select="fileSelect"
            ></draal-file-import>

            <a
              class="col-sm"
              :href="linkUrl"
              :download="linkDownload"
            >
              <v-btn>Paina tästä</v-btn>
              <!--v-icon>mdi-export</v-icon-->
            </a>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>TESTI</v-expansion-panel-header>
        <v-expansion-panel-content>
          <draal-icon-dialog
            :tooltip-config="{ 'icon-size': 'large' }"
            tooltip-text="Icon tooltip"
            dialog-title="This is title"
            dialog-content="This is content"
          ></draal-icon-dialog>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

import { SCHEMA, TIMELINE_TYPES, SCHEMA1 } from './schema';
import DraalEventData from './EventData.vue';
import DraalEventDataEdit from './EventDataEdit.vue';

import { AudioApi } from '@/common/api';
import DraalSpinner from '@/components/core/utils/Spinner.vue';
import DraalFormGenerator from '@/components/core/form/Form.vue';
import { notificationActions } from '@/store/helpers';
import { NotificationMessage } from '@/common/models';
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';
import DraalFileImport from '@/components/core/utils/FileImport.vue';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';
import DraalTooltipMenu from '@/components/core/utils/TooltipMenu.vue';

// TODO: Split to tabs

export default {
    components: {
        DraalSpinner,
        DraalFormGenerator,
        DraalIconDialog,
        DraalFileImport,
        DraalTooltip,
        DraalTooltipMenu,
        DraalEventData,
        DraalEventDataEdit
    },
    data() {
        const schema = [...SCHEMA];
        const schema1 = [...SCHEMA1];

        const iconSize = 'large';

        schema1.forEach(item => {
            const data = item;

            if (item.type === 'local-audio-file') {
                data.dataQuery = this.wavQuery.bind(this);
                data.fileQueryFn = this.fileQuery.bind(this);
            } else if (item.type === 'file-data-query') {
                data.dataQuery = this.dataQuery.bind(this);
                data.fileQueryFn = this.fileQuery.bind(this);
            } else if (item.type === 'file-open') {
                data.fileQueryFn = this.fileQuery.bind(this);
            }
        });

        schema.forEach(item => {
            const data = item;

            if (item.type === 'file-data-query') {
                data.dataQuery = this.dataQuery.bind(this);
                data.fileQueryFn = this.fileQuery.bind(this);
            } else if (item.type === 'timeline') {
                data.toolbarIconSize = iconSize;
            } else if (item.type === 'file-open') {
                data.fileQueryFn = this.fileQuery.bind(this);
            }
        });

        const json = { a: 'foo', b: [1, 2, 3] };
        const blob = new Blob([JSON.stringify(json, null, 4)], { type: 'application/json' });
        const linkUrl = URL.createObjectURL(blob);
        const linkDownload = 'test.json';

        return {
            linkUrl,
            linkDownload,

            timelineTypes: TIMELINE_TYPES,

            schema1,
            formData1: {
                bin: null,
                audio: null,
                fileid: null
            },

            data: null,
            processing: false,
            formData: {
                device: null,
                bitrate: null,
                input: null,
                output: null,
                comment: null,
                windscreen: false,
                timeline: [],
                row: {},
                radio: -1
            },
            options: {
                submit: this.$t('configuratorPage.createRec'),
                clear: this.$t('configuratorPage.clearForm')
            },
            schema,
            activePanel: 0,

            fileDialog: false,

            queryFailure: false,

            toolIconAttrs: {
                position: 'top',
                iconSize
            },

            timelineToolbarIcons: [
                {
                    name: 'Left',
                    icon: 'mdi-pan-left',
                    value: 90
                },
                {
                    name: 'Front',
                    icon: 'mdi-pan-up',
                    value: 0
                },
                {
                    name: 'Back',
                    icon: 'mdi-pan-down',
                    value: 180
                },
                {
                    name: 'Right',
                    icon: 'mdi-pan-left',
                    value: -90
                }
            ],

            menuPresets: [
                {
                    title: 'Preset 1',
                    fn: data => {
                        this.iconClick(data, 140);
                    }
                }
            ],
            menuAttrs: {
                [`${iconSize}`]: true
            }
        };
    },
    methods: {
        ...notificationActions,

        submit(data) {
            /* eslint-disable-next-line */
            console.log(data);
        },

        encode(encData) {
            /* eslint-disable-next-line */
            console.log(encData);
            this.activePanel = 1;
        },

        resetField(field) {
            if (field === 'windscreen') {
                return false;
            }

            return undefined;
        },

        fileSelect(files) {
            /* eslint-disable-next-line */
            console.log('selected', files);
        },

        wavQuery(filename) {
            return AudioApi.wavInfo(encodeURIComponent(filename)).pipe(
                catchError(() => ({ data: {} }))
            );
        },

        fileQuery(prefix, ext) {
            return AudioApi.fileList(prefix, ext).pipe(
                catchError(() => ({ data: [] }))
            );
        },

        dataQuery(file) {
            if (this.queryFailure) {
                const timeout = 5000;
                const msg = `Error in parsing file ${file.name || file.path}`;
                this.addNotification(NotificationMessage.createError(msg, { timeout }));

                this.queryFailure = false;
                return throwError([msg]);
            }

            this.queryFailure = true;

            return of([
                { uuid: 'UUID 1' },
                { uuid: 'UUID 2' },
                { uuid: 'UUID 3' },
                { uuid: 'UUID 4' },
                { uuid: 'UUID 5' },
                { uuid: 'Set your own ID', custom: true }
            ]).pipe(delay(2500));
        },

        renderAzimuth(data) {
            return `transform: rotate(${-data.angle}deg)`;
        },

        iconClick({ add }, angle) {
            const type = this.timelineTypes.dir;
            const zoom = 90;
            add(5, (position, maxPos, index, cb) => {
                cb({
                    angle, zoom, position: position + index * 0.5, type
                });
            });
        },

        addEvent({ add }, type = TIMELINE_TYPES.dir) {
            add(null, null, type);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
    color: #42b983;
}
</style>
