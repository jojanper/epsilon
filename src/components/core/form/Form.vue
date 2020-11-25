<template>
  <div :key="componentKey">
    <ValidationObserver ref="observer" v-slot="{ invalid, valid }">
      <form class="pb-2">
        <component
          v-for="(field, index) in schema"
          :key="index"
          :is="field.fieldType"
          :value="formData[field.name]"
          @input="updateForm(field.name, $event)"
          v-bind="field"
          @form-input-help="formInputHelp"
        ></component>

        <v-btn
          class="mr-2"
          :disabled="invalid || !valid"
          v-on:click="$emit('submit', formData)"
          color="primary"
        >{{ options.submit }}</v-btn>
        <v-btn v-if="options.clear" @click="clear">{{ options.clear }}</v-btn>
      </form>
    </ValidationObserver>

    <draal-dialog
      :model="helpDialog"
      :title="helpText.title"
      :text="helpText.body"
      @close-dialog="helpDialog=false"
      bodyCls="text-left"
      maxWidth="500"
    ></draal-dialog>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';

import TextInput from './inputs/TextInput.vue';
import SelectInput from './inputs/SelectInput.vue';
import CheckboxInput from './inputs/CheckboxInput.vue';
import FileOpenInput from './inputs/FileOpenInput.vue';
import RemoteFileSaveInput from './inputs/RemoteFileSaveInput.vue';
import WheelInput from './inputs/WheelInput.vue';
import IDSelectionInput from './inputs/IDSelection.vue';
import FocusTimeline from './inputs/FocusTimeline.vue';
import RowInput from './inputs/RowInput.vue';
import DraalDialog from '../utils/Dialog.vue';
import { appComputed } from '@/store/helpers';

export default {
    name: 'DraalFormGenerator',
    components: {
        TextInput,
        SelectInput,
        CheckboxInput,
        WheelInput,
        FocusTimeline,
        RowInput,
        FileOpenInput,
        RemoteFileSaveInput,
        IDSelectionInput,
        ValidationProvider,
        ValidationObserver,
        DraalDialog
    },
    props: ['schema', 'value', 'options', 'reset'],
    data() {
        return {
            helpText: {
                title: null,
                body: null
            },
            helpDialog: false,
            formData: this.value || {},
            componentKey: 0
        };
    },
    computed: {
        appLang: appComputed.appLang
    },
    watch: {
        appLang() {
            // Re-validate to re-generate localized messages.
            this.$refs.observer.validate();
        }
    },
    methods: {
        forceRendeder() {
            this.componentKey += 1;
        },

        updateForm(fieldName, value) {
            this.$set(this.formData, fieldName, value);
        },

        clear() {
            for (let i = 0; i < this.schema.length; i++) {
                const fieldName = this.schema[i].name;
                if (Array.isArray(this.formData[fieldName])) {
                    this.formData[fieldName].splice(0, this.formData[fieldName].length);
                } else {
                    this.$set(this.formData, fieldName, this.reset(fieldName));
                }
            }
            this.forceRendeder();
        },

        formInputHelp(name) {
            for (let i = 0; i < this.schema.length; i++) {
                const fieldName = this.schema[i].name;
                if (fieldName === name) {
                    this.helpText = this.schema[i].help;
                    break;
                }
            }

            this.helpDialog = true;
        }
    }
};
</script>
