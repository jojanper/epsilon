<template>
  <div class="mt-3 mb-3">
    <v-tabs vertical>
      <v-tab>
        <v-icon left>mdi-identifier</v-icon>
        {{ $t('fileUtils.title') }}
      </v-tab>

      <v-tab-item>
        <v-card flat>
          <v-card-text class="text-left">
            <draal-upload-terminal
              :description="$t('fileUtils.text')"
              :uploadFn="uploadFn"
              drag-class="text-underline utils-terminal-upload"
              icon-size-drag="medium"
              :ext-data="{ versions: data }"
            >
              <template v-slot:icon-right>
                <div class="w-50 mt-8">
                  <select-input
                    :placeholder="$t('fileUtils.select')"
                    :value="data"
                    :data="getUtilsViewProperties('fileProperties')"
                    name="test"
                    :label="$t('fileUtils.select')"
                    @input="setData"
                    multiple
                    outlined
                    clearable
                  ></select-input>
                </div>
              </template>
            </draal-upload-terminal>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { AudioApi } from '@/common/api';
import { appComputed } from '@/store/helpers';
import SelectInput from '@/components/core/form/inputs/SelectInput.vue';
import DraalUploadTerminal from '@/components/core/terminal/UploadTerminal.vue';

export default {
    name: 'DraalUploadUtils',
    components: {
        DraalUploadTerminal,
        SelectInput
    },
    data() {
        return {
            data: [],
            uploadFn: AudioApi.uploadFile.bind(AudioApi)
        };
    },
    computed: {
        getUtilsViewProperties: appComputed.getUtilsViewProperties
    },
    methods: {
        setData(data) {
            this.data = data;
        }
    }
};
</script>
