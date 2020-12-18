<template>
  <div :key="componentKey">
    <ValidationObserver ref="observer" v-slot="{ invalid, valid }">
      <form class="pb-2">
        <draal-form-input
          v-for="(field, index) in schema"
          :key="index"
          :value="formData[field.name]"
          @input="(value, ext) => updateForm(field.name, value, ext)"
          v-bind="field"
          @form-input-help="formInputHelp"
          @data-rel-update="registerUpdateHandler"
        >
          <template v-for="(columnDef, index) in customRender" v-slot:[columnDef.column]="{ data }">
            <!--
                @slot Custom input data rendering.
                @binding {number} inputKey Input key (Vue key attribute).
                @binding {object} data Input data.
            -->
            <slot :name="columnDef.name" v-bind:inputKey="index" v-bind:data="data"></slot>
          </template>
          <template v-slot:input.focusTimeline.angleDir2>FORM COMPONENT</template>
        </draal-form-input>

        <div class="mt-3">
          <v-btn
            class="mr-2"
            :disabled="invalid || !valid"
            v-on:click="$emit('submit', formData)"
            color="primary"
          >{{ options.submit }}</v-btn>
          <v-btn v-if="options.clear" @click="clear">{{ options.clear }}</v-btn>
        </div>
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
import { ValidationObserver } from 'vee-validate';

import { appComputed } from '@/store/helpers';
import { getDataField, resetDataBySchema } from '@/common/utils';

import DraalFormInput from './FormInput.vue';
import DraalDialog from '../utils/Dialog.vue';

export default {
    name: 'DraalFormGenerator',
    components: {
        ValidationObserver,
        DraalFormInput,
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
    created() {
        this.dataRelHandlers = {};
    },
    computed: {
        appLang: appComputed.appLang,

        customRender() {
            // const colDef = this.customSlots || [];

            const t = this.schema.flatMap(entry => {
                const slots = entry.customSlots || [];
                console.log(entry.name, slots);
                // return [];
                return slots.map(column => ({
                    column: `input.${entry.name}.${column}`,
                    name: `form.${entry.name}.${column}`
                }));
            });

            console.log(t);
            return t;
        }
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

        // Update form data
        updateForm(fieldName, value, ext) {
            this.$set(this.formData, fieldName, value);

            // Name of actual target. The field name is high level name,
            // detailed name is given by the ext parameter.
            const target = ext || fieldName;

            // If input data relations are defined, send the changed data
            // to relevant form input components
            if (this.dataRelHandlers[target]) {
                const targetInputs = Object.keys(this.dataRelHandlers[target]);
                targetInputs.forEach(key => {
                    const inputs = this.dataRelHandlers[target][key];
                    inputs.forEach(cb => cb(target, value));
                });
            }
        },

        // Clear form data
        clear() {
            resetDataBySchema(this.schema, this.formData, '', this.reset);
            this.forceRendeder();
        },

        // Show help data for specified input
        formInputHelp(name) {
            // Locate the help data from schema
            const split = name.split('.');
            let data = { schema: this.schema };
            for (let i = 0; i < split.length; i++) {
                data = getDataField(data.schema, split[i], 'name');
            }

            // Show the help data
            this.helpText = data.help;
            this.helpDialog = true;
        },

        /**
         * Register form input data observers. Input may request to be notified
         * when form data changes in other form input components.
         *
         * @param {string } name Input name requesting data notifications.
         * @param {array<string>} target Requested data input names.
         * @param {function} cb Callback for data notifications.
         */
        registerUpdateHandler(name, targets, cb) {
            targets.forEach(target => {
                if (!this.dataRelHandlers[target]) {
                    this.dataRelHandlers[target] = {};
                }

                if (!this.dataRelHandlers[target][name]) {
                    this.dataRelHandlers[target][name] = [];
                }

                this.dataRelHandlers[target][name].push(cb);
            });
        }
    }
};
</script>
