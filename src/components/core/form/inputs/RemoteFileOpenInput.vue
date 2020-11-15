<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-text-field
      class="remote-input"
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
        v-if="canDrop"
        @fileDrop="onDrop"
        slot="append"
        :title="dropTitle || $t('form.remoteInputDropTitle')"
      ></draal-file-drop>
    </v-text-field>
  </ValidationProvider>
</template>

<script>
import { remoteInputMixin } from './remoteInputMixin';

export default {
    name: 'RemoteFileOpenInput',
    mixins: [remoteInputMixin],
    methods: {
        clicked() {
            if (this.canDrop) {
                const { ipcRenderer } = window.require('electron');

                // Open remote file selection dialog
                ipcRenderer.send('open-modal', this.name);

                // Selected file is received via this event
                ipcRenderer.on('open-file', (event, data) => {
                    if (data.name === this.name) {
                        this.setInput(data.file);
                    }
                });
            }
        }
    }
};
</script>
