<template>
  <div>
    <h1>{{ $t('configuratorPage.title') }}</h1>

    <v-expansion-panels class="mt-3 mb-3" v-model="activePanel">
      <v-expansion-panel>
        <v-expansion-panel-header>{{ $t('configuratorPage.confPanelTitle') }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <span
            class="float-left2 row2 p-0 m-0 position-absolute2 position-relative2 d-block2 clearfix"
          >
            <draal-tooltip name="HELLO" icon2="mdi-import" position="right">
              <template v-slot:default="{ on }">
                <div
                  v-on="on"
                  class="float-left clearfix2 float2-left row2 m-0 mb-4 position-relative2 position-absolute2"
                  @click="fileSelect"
                >
                  <draal-file-drop
                    icon-color="pink"
                    icon="mdi-import"
                    cls="export-json"
                    @fileDrop="fileSelect"
                  ></draal-file-drop>
                </div>
              </template>
            </draal-tooltip>
          </span>

          <div class2="row p-0 m-0">
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
            </draal-form-generator>
          </div>

          <draal-file-dialog color="blue" icon="mdi-folder-open" @file-select="fileSelect"></draal-file-dialog>

          <v-icon @click="fileDialog=true">mdi-plus</v-icon>
          <draal-file-dialog multiple v-model="fileDialog" @file-select="fileSelect"></draal-file-dialog>

          <a :href="linkUrl" :download="linkDownload">THIS IS LINK</a>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>TESTI</v-expansion-panel-header>
        <v-expansion-panel-content>
          <draal-icon-dialog
            :tooltip-config="{ 'icon-size': 'large' }"
            tooltip-name="Icon tooltip"
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
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';
import DraalFileDrop from '@/components/core/utils/FileDrop.vue';
import DraalIconDialog from '@/components/core/utils/IconDialog.vue';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';

export default {
    components: {
        DraalSpinner,
        DraalFormGenerator,
        DraalFileDialog,
        DraalIconDialog,
        DraalFileDrop,
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

            queryFailure: false
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
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
    color: #42b983;
}

.export-json {
    margin-top2: 48px;
    margin-bott2om: 48px;
    font-siz2e: 128px;
}
</style>
