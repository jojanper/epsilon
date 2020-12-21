<template>
  <div v-if="isRowMode()" class="row">
    <div class="ml-auto col-md m-0" v-for="(field, index) in schema" :key="index">
      <draal-form-input
        :key="index"
        :value="value[field.name]"
        v-bind="field"
        v-bind:slotPrefix="`${name}.`"
        v-on="listeners"
        @input="updateForm(field.name, $event)"
      >
        <template v-for="(def, index) in slotsDef" v-slot:[def.childSlot]="{ data }">
          <!--
            @slot Custom input data rendering.
            @binding {number} inputKey Input key (Vue key attribute).
            @binding {object} data Input data.
          -->
          <slot :name="def.componentSlot" v-bind:inputKey="index" v-bind:data="data"></slot>
        </template>
      </draal-form-input>
    </div>
  </div>
</template>

<script>
import { slotMapping } from '@/common/utils';

/**
 * Form inputs are rendered in a row element (side by side).
 *
 * @displayName RowInput
 */
export default {
    name: 'GroupInput',
    components: {
        // Circular reference between form input, use Webpack’s asynchronous import
        DraalFormInput: () => import('./FormInput.vue')
    },
    props: {
        /**
         * Form input definitions as JSON schema.
         */
        schema: {
            type: Array,
            required: true
        },
        /**
         * Form data for each input.
         */
        value: {
            required: true
        },
        /**
         * Name of row input.
         */
        name: {
            type: String,
            required: true
        },
        /**
         * Group rendering mode. Currently supported modes:
         * - row: Form inputs are rendered as row element
         */
        renderMode: {
            type: String,
            required: true
        }
    },
    data() {
        const slotsDef = [];
        slotMapping(slotsDef, this.schema, `${this.name}.`, 'input', 'input');

        const listeners = {
            ...this.$listeners,

            // Input help name must be updated so that parent can locate correct data entry
            'form-input-help': name => this.$emit('form-input-help', `${this.name}.${name}`),

            // Data relation also needs naming update
            'data-rel-update': (name, target, fn) => {
                this.$emit('data-rel-update', `${this.name}.${name}`, target, fn);
            }
        };

        // Delete parent input listener, we use our own here
        delete listeners.input;

        return {
            listeners,
            slotsDef
        };
    },
    methods: {
        isRowMode() {
            return this.renderMode === 'row';
        },

        updateForm(fieldName, value) {
            // Update the form data group value
            this.$set(this.value, fieldName, value);

            // Let the listeners also know the detailed input name
            // to which this update is related to.
            this.$emit('input', this.value, `${this.name}.${fieldName}`);
        }
    }
};
</script>
