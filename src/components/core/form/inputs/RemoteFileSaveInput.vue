<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-text-field
      :class="`file-input ${classes}`"
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :placeholder="placeholder"
      @click="clicked"
      @input="inputChangeEvent"
    >
      <input-help v-if="help" slot="append-outer" @form-input-help="inputHelpEvent"></input-help>
      <draal-file-drop
        @fileDrop="onDrop"
        slot="append"
        :title="dropTitle || $t('form.remoteInputDropTitle')"
      ></draal-file-drop>
    </v-text-field>
  </ValidationProvider>
</template>

<script>
import { fileInputMixin } from './fileInputMixin';

/**
 * File input for selecting output file from remote.
 * Use mainly in Electron environment.
 *
 * @displayName RemoteFileSaveInput
 */
export default {
    name: 'RemoteFileSaveInput',
    mixins: [fileInputMixin],
    methods: {
        clicked() {
            if (this.canDrop) {
                const { ipcRenderer } = window.require('electron');

                // Open remote file selection dialog
                ipcRenderer.send('save-modal', this.name);

                // Selected file is received via this event
                ipcRenderer.on('save-file', (event, data) => {
                    if (data.name === this.name) {
                        this.setInput(data.file);
                        this.sendInputEvent();
                    }
                });
            }
        }
    }
};
</script>
