<template>
  <div>
    <h1>{{ $t('configuratorPage.title') }}</h1>

    <v-expansion-panels class="mt-3 mb-3" v-model="activePanel">
      <v-expansion-panel>
        <v-expansion-panel-header>{{ $t('configuratorPage.confPanelTitle') }}</v-expansion-panel-header>
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
            <template v-slot:form.row.focusTimeline2.angleDir="{ data }">
              <v-icon :style="renderAzimuth(data)">mdi-arrow-up</v-icon>
            </template>

            <template v-slot:form.focusTimeline.angleDir="{ data }">
              <v-icon :style="renderAzimuth(data)">mdi-arrow-up</v-icon>
            </template>

            <template v-slot:form.focusTimeline.toolbar-left="{ data }">
              <div>
                <draal-tooltip
                  v-bind="toolIconAttrs"
                  name="Left focus"
                  icon="mdi-pan-left"
                  @clicked="iconClick(data, 90)"
                ></draal-tooltip>
                <draal-tooltip
                  v-bind="toolIconAttrs"
                  name="Front focus"
                  icon="mdi-pan-up"
                  @clicked="iconClick(data, 0)"
                ></draal-tooltip>
                <draal-tooltip
                  v-bind="toolIconAttrs"
                  name="Back focus"
                  icon="mdi-pan-down"
                  @clicked="iconClick(data, 180)"
                ></draal-tooltip>
                <draal-tooltip
                  v-bind="toolIconAttrs"
                  name="Right focus"
                  icon="mdi-pan-right"
                  @clicked="iconClick(data, -90)"
                ></draal-tooltip>
              </div>
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

            <a class="col-sm" :href="linkUrl" :download="linkDownload">THIS IS LINK</a>
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
import { delay } from 'rxjs/operators';

import { SCHEMA } from './schema';
import DraalSpinner from '../../components/core/utils/Spinner.vue';
import DraalFormGenerator from '../../components/core/form/Form.vue';
import { notificationActions } from '@/store/helpers';
import { NotificationMessage } from '@/common/models';
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';
import DraalFileImport from '@/components/core/utils/FileImport.vue';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';

export default {
    components: {
        DraalSpinner,
        DraalFormGenerator,
        DraalIconDialog,
        DraalFileImport,
        DraalTooltip
    },
    data() {
        const schema = [...SCHEMA];

        schema[6].dataQuery = this.dataQuery.bind(this);

        const json = { a: 'foo', b: [1, 2, 3] };
        const blob = new Blob([JSON.stringify(json, null, 4)], { type: 'application/json' });
        const linkUrl = URL.createObjectURL(blob);
        const linkDownload = 'test.json';

        return {
            linkUrl,
            linkDownload,


            data: null,
            processing: false,
            formData: {
                device: null,
                bitrate: null,
                input: null,
                output: null,
                comment: null,
                windscreen: false,
                focusTimeline: [],
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
                iconSize: 'large'
            }
        };
    },
    methods: {
        ...notificationActions,

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

        dataQuery(file) {
            if (this.queryFailure) {
                const timeout = 5000;
                const msg = `Error in parsing file ${file.name}`;
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
            add(5, (position, maxPos, index, cb) => {
                cb({ angle, zoom: 90, position: position + index * 0.5 });
            });
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
