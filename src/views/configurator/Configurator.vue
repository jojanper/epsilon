<template>
  <div>
    <h1>{{ $t('configuratorPage.title') }}</h1>

    <v-expansion-panels class="mt-3 mb-3" v-model="activePanel">
      <v-expansion-panel>
        <v-expansion-panel-header>{{ $t('configuratorPage.confPanelTitle') }}</v-expansion-panel-header>
        <v-expansion-panel-content>
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

          <draal-file-dialog color="blue" icon="mdi-folder-open" @file-select="fileSelect"></draal-file-dialog>

          <v-icon @click="fileDialog=true">mdi-plus</v-icon>
          <draal-file-dialog multiple v-model="fileDialog" @file-select="fileSelect"></draal-file-dialog>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>TESTI</v-expansion-panel-header>
        <v-expansion-panel-content>HELLO</v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { NotificationMessage } from '@/common/models';
import { notificationActions } from '@/store/helpers';
import DraalSpinner from '../../components/core/utils/Spinner.vue';
import DraalFormGenerator from '../../components/core/form/Form.vue';
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';
import { SCHEMA } from './schema';

export default {
    components: {
        DraalSpinner,
        DraalFormGenerator,
        DraalFileDialog
    },
    data() {
        const schema = [...SCHEMA];

        schema[6].dataQuery = this.dataQuery.bind(this);

        return {
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
</style>
