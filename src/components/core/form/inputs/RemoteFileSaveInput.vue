<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-text-field
      class="remote-input"
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :placeholder="placeholder"
      @click="clicked"
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
import { ValidationProvider } from 'vee-validate';

import InputHelp from './InputHelp.vue';
import DraalFileDrop from '../../utils/FileDrop.vue';

export default {
    name: 'RemoteFileOpenInput',
    components: {
        ValidationProvider,
        InputHelp,
        DraalFileDrop
    },
    props: ['placeholder', 'label', 'name', 'value', 'rules', 'help'],
    data() {
        return {
            fieldValue: this.value,
            canDrop: !!window.require
        };
    },
    methods: {
        onDrop(files) {
            // Set the file name from the dropped target
            this.setInput(files[0].path);
        },

        clicked() {
            if (this.canDrop) {
                const { ipcRenderer } = window.require('electron');

                // Open remote file selection dialog
                ipcRenderer.send('saveModal', this.name);

                // Selected file is received via this event
                ipcRenderer.on('save-file', (event, data) => {
                    if (data.name === this.name) {
                        this.setInput(data.file);
                    }
                });
            }
        },

        setInput(fileName) {
            this.fieldValue = fileName;
            this.$emit('input', this.fieldValue);
        }
    }
};
</script>
