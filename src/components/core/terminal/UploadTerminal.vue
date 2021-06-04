<template>
  <draal-spinner :state="processing">
    <p>{{ description }}</p>
    <div class="row">
      <div class="col-md-1">
        <draal-file-drop
          @fileDrop="onDrop"
          v-bind="$attrs"
        ></draal-file-drop>
      </div>
      <div class="col-md-11">
        <slot name=icon-right></slot>
      </div>
    </div>

    <div v-if="terminalData.length">
      <!-- Show shell response data -->
      <draal-terminal
        :title="fileName"
        :dataInput="terminalData"
      ></draal-terminal>
    </div>

    <!-- Show also upload progress while spinner is visible -->
    <template v-slot:spinner>
      <div class="text-center">{{ completed }}%</div>
    </template>
  </draal-spinner>
</template>

<script>
import DraalTerminal from './Terminal.vue';
import { terminalMixin } from './terminalMixin';

import DraalFileDrop from '@/components/core/utils/FileDrop.vue';
import DraalSpinner from '@/components/core/utils/Spinner.vue';

/**
 * Upload file to remote and show response in terminal window.
 */
export default {
    name: 'DraalUploadTerminal',
    mixins: [terminalMixin],
    components: {
        DraalFileDrop,
        DraalTerminal,
        DraalSpinner
    },
    props: {
        /**
         * Usage description.
         */
        description: {
            type: String,
            required: true
        },
        /**
         * Function handling the upload, must return Observable.
         */
        uploadFn: {
            type: Function,
            required: true
        },
        /**
         * Additional plain object data to be associated with upload.
         */
        extData: {
            type: Object,
            required: false,
            default: null
        }
    },
    data() {
        return {
            fileName: '',
            completed: 0
        };
    },
    methods: {
        onDrop(files) {
            this.fileName = files[0].name;
            this.terminalExec(
                // Terminal mixin will handle the remote response -> pass Observable as input parameter
                // Upload progress is handled in this component.
                this.uploadFn(files[0], this.extData, progress => {
                    this.completed = Math.round((progress.loaded * 100) / progress.total);
                })
            );
        }
    }
};
</script>

<style lang="scss" scoped>
.dropbox {
    margin-top: 0px;
    margin-bottom: 20px;
    font-size: 128px;
}
</style>
