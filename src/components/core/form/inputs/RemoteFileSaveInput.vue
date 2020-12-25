<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-text-field
      class="form-input remote-input mt-0 pt-0 pb-2"
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :placeholder="placeholder"
      @click="clicked"
      :readonly="readOnly"
      @input="$emit('input', fieldValue)"
    >
      <input-help v-if="help" slot="append-outer" @form-input-help="$emit('form-input-help', name)"></input-help>
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
