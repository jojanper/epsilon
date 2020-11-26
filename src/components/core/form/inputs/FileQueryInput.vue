<template>
  <ValidationObserver ref="observer">
    <ValidationProvider ref="provider" v-slot="{ errors }" :name="name" :rules="inputRules">
      <v-text-field
        class="remote-input"
        v-model="fieldValue"
        :error-messages="errors"
        :label="label"
        :placeholder="placeholder"
        @click="fileDialog=true"
        :readonly="true"
      >
        <input-help
          v-if="help"
          slot="append-outer"
          @form-input-help="$emit('form-input-help', name)"
        ></input-help>
        <draal-file-drop
          @fileDrop="onDrop"
          slot="append"
          :title="dropTitle || $t('form.remoteInputDropTitle')"
        ></draal-file-drop>
      </v-text-field>
    </ValidationProvider>

    <div class="row p-0 pb-1" v-if="fieldValue">
      <div class="col">
        <draal-spinner
          :state="processing"
          width="40"
          height="40"
          type="spinner-3"
          class="float-left"
        ></draal-spinner>
        <ValidationProvider name="selected" v-if="listData.length">
          <select-input
            :placeholder="selectPlaceholder"
            :value="selectedData"
            :selectlist="listData"
            name="select-list"
            :label="selectLabel"
            :data-key="dataKey"
            @input="setSelectedData"
            rules="required"
            simple="true"
          ></select-input>
        </ValidationProvider>
      </div>

      <div class="col">
        <ValidationProvider name="custom" v-if="customId" v-slot="{ errors }" rules="required">
          <v-text-field
            v-model="customValue"
            :label="customLabel"
            :error-messages="errors"
            :placeholder="customPlaceholder"
            @input="setCustomValue"
          ></v-text-field>
        </ValidationProvider>
      </div>
    </div>

    <!-- File dialog is also hidden -->
    <draal-file-dialog v-model="fileDialog" @file-select="onDrop"></draal-file-dialog>
  </ValidationObserver>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';

import InputHelp from './InputHelp.vue';
import SelectInput from './SelectInput.vue';
import DraalFileDrop from '@/components/core/utils/FileDrop.vue';
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';
import DraalSpinner from '@/components/core/utils/Spinner.vue';

/**
 * Data query assisted select input.
 *
 * @displayName FileQueryInput
 */
export default {
    name: 'FileQueryInput',
    components: {
        ValidationProvider,
        ValidationObserver,
        InputHelp,
        SelectInput,
        DraalFileDrop,
        DraalFileDialog,
        DraalSpinner
    },
    // TODO: Document props and place to some common module to general usage!
    props: [
        'placeholder',
        'label',
        'name',
        'value',
        'rules',
        'help',
        'dropTitle',
        'selectPlaceholder',
        'selectLabel',
        'customPlaceholder',
        'customLabel',
        'dataQuery',
        'queryRule',
        'dataKey'
    ],
    data() {
        const rules = this.rules || '';
        const inputRules = !this.queryRule ? rules : `${rules}|${this.queryRule}:@selected,@custom`;

        const fieldValue = this.value ? this.value.file : null;
        const listData = this.value ? this.value.listData : [];
        const selectedData = this.value ? this.value.selected : null;
        const customValue = this.value ? this.value.value : null;
        const customId = customValue;

        return {
            fieldValue,
            fileDialog: false,

            inputRules,

            listData,
            selectedData,

            customId,
            customValue,

            processing: false
        };
    },
    methods: {
        // User selected file (either using file dialog or file was dropped)
        onDrop(files) {
            const file = files[0];

            this.customId = false;
            this.processing = true;
            this.fieldValue = file.path || file.name;
            this.listData.splice(0, this.listData.length);

            this.validateInput();

            // Get the list data
            this.dataQuery(file).subscribe(data => {
                this.processing = false;
                data.forEach(element => this.listData.push(element));
                this.validateInput();
            }, err => {
                this.processing = false;

                const error = {};
                error[this.name] = err;

                // Show the error after input validation cycle has stabilized
                setTimeout(() => this.$refs.observer.setErrors(error), 100);
            });
        },

        // Item selected from list
        setSelectedData(data) {
            this.selectedData = data;
            this.validateInput();

            if (data.custom === true) {
                this.customId = true;
            } else {
                this.customId = false;
                this.sendInputEvent();
            }
        },

        // User manually entered the value
        setCustomValue(value) {
            this.customValue = value;
            this.sendInputEvent();
            this.validateInput();
        },

        // Input event is emitted
        sendInputEvent() {
            const value = this.customValue || (this.selectedData ? this.selectedData[this.selectKey] : null);
            const data = {
                file: this.fieldValue,
                listData: this.listData,
                selected: this.selectedData,
                custom: this.customValue,
                value
            };

            this.$emit('input', data);
        },

        // Trigger cross-field validation
        validateInput() {
            setTimeout(this.$refs.provider.validate, 0);
        }
    }
};
</script>
