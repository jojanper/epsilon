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
          ></draal-form-generator>
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
import DraalSpinner from '../../components/utils/Spinner.vue';
import DraalFormGenerator from '../../components/form/Form.vue';
import { SCHEMA } from './schema';

export default {
    components: {
        DraalSpinner,
        DraalFormGenerator
    },
    data() {
        return {
            data: null,
            processing: false,
            formData: {
                device: null,
                bitrate: null,
                input: null,
                output: null,
                windscreen: false,
                focusTimeline: []
            },
            options: {
                submit: this.$t('configuratorPage.createRec'),
                clear: this.$t('configuratorPage.clearForm')
            },
            schema: SCHEMA,
            activePanel: 0
        };
    },
    methods: {
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
