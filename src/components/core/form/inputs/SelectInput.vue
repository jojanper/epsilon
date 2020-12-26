<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-select
      :class="cls"
      v-if="simple"
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :items="selectlist"
      :placeholder="placeholder"
      :item-text="dataKey"
      v-bind="attrs"
      @input="$emit('input', fieldValue)"
    >
      <input-help v-if="help" slot="append-outer" @form-input-help="$emit('form-input-help', name)"></input-help>
    </v-select>
    <v-autocomplete
      v-else
      :class="cls"
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :items="selectlist"
      :placeholder="placeholder"
      :item-text="dataKey"
      v-bind="attrs"
      @input="$emit('input', fieldValue)"
    >
      <input-help v-if="help" slot="append-outer" @form-input-help="$emit('form-input-help', name)"></input-help>
    </v-autocomplete>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

import InputHelp from './InputHelp.vue';

export default {
    name: 'SelectInput',
    components: {
        ValidationProvider,
        InputHelp
    },
    props: ['placeholder', 'label', 'name', 'value', 'rules', 'selectlist', 'help', 'dataKey', 'simple', 'classes'],
    data() {
        const attrs = this.dataKey ? { 'return-object': true } : {};

        return {
            attrs,
            fieldValue: this.value,
            cls: this.classes || 'form-input mt-0 pt-0 pb-2'
        };
    }
};
</script>
