<template>
  <draal-spinner :state="processing">
    <p>{{ description }}</p>
    <draal-file-drop @fileDrop="onDrop"></draal-file-drop>

    <div v-if="terminalData.length">
      <p>{{ fileName }}:</p>
      <!-- Show shell response data -->
      <draal-terminal :dataInput="terminalData"></draal-terminal>
    </div>

    <!-- Show also upload progress while spinner is visible -->
    <template v-slot:spinner>
      <div class="text-center">{{ completed }}%</div>
    </template>
  </draal-spinner>
</template>

<script>
import DraalFileDrop from '../utils/FileDrop.vue';
import DraalSpinner from '../utils/Spinner.vue';
import DraalTerminal from './Terminal.vue';
import { terminalMixin } from './terminalMixin';

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
                this.uploadFn(files[0], progress => {
                    this.completed = Math.round((progress.loaded * 100) / progress.total);
                })
            );
        }
    }
};
</script>

<style lang="scss" scoped>
.dropbox {
    margin-top: 48px;
    margin-bottom: 48px;
    font-size: 128px;
}
</style>
