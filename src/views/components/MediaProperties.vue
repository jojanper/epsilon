<template>
  <div>
    <div
      class="text-left mb-4 text-lg-subtitle-1"
      v-html="$t('fileUtils.text')"
    >
    </div>
    <draal-upload-terminal
      :uploadFn="uploadFn"
      description=""
      drag-class="text-underline utils-terminal-upload"
      icon-size-drag="medium"
      :ext-data="{ versions: data }"
    >
      <template v-slot:icon-right>
        <div class="mt-8">
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
  </div>
</template>

<script>
import { AudioApi } from '@/common/api';
import { appComputed } from '@/store/helpers';
import SelectInput from '@/components/core/form/inputs/SelectInput.vue';
import DraalUploadTerminal from '@/components/core/terminal/UploadTerminal.vue';

export default {
    name: 'DraalExampleMediaProperties',
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
