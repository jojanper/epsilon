<template>
  <ValidationProvider
    v-slot="{ errors }"
    :name="name"
    :rules="rules"
  >
    <v-select
      :class="classes"
      v-if="!autocomplete"
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :items="data"
      :placeholder="placeholder"
      :item-text="dataKey"
      v-bind="{ ...attrs, ...inputAttrs }"
      @input="inputChangeEvent"
    >
      <template slot="append-outer">
        <slot name="append-outer">
          <input-help
            v-if="help"
            @form-input-help="inputHelpEvent"
          ></input-help>
        </slot>
      </template>
      <template slot="prepend">
        <slot name="prepend"></slot>
      </template>
    </v-select>
    <v-autocomplete
      v-else
      :class="classes"
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :items="data"
      :placeholder="placeholder"
      :item-text="dataKey"
      v-bind="{ ...attrs, ...inputAttrs }"
      @input="inputChangeEvent"
    >
      <template slot="append-outer">
        <slot name="append-outer">
          <input-help
            v-if="help"
            @form-input-help="inputHelpEvent"
          ></input-help>
        </slot>
      </template>
      <template slot="prepend">
        <slot name="prepend"></slot>
      </template>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import BaseInput from './BaseInput.vue';
import { data, dataKey } from './options';

export default {
    name: 'SelectInput',
    extends: BaseInput,
    props: {
        data,
        dataKey,
        /**
         * Use plain select or autocomplete component as selection component.
         */
        autocomplete: {
            type: Boolean,
            required: false,
            default: false
        },
        /*
         * Enable multiple selections.
         */
        multiple: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        const attrs = this.dataKey ? { 'return-object': true } : {};

        if (this.multiple) {
            attrs.multiple = true;
        }

        return {
            attrs
        };
    }
};
</script>
