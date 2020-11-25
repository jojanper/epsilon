<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-select
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
    props: ['placeholder', 'label', 'name', 'value', 'rules', 'selectlist', 'help', 'dataKey', 'simple'],
    data() {
        const attrs = this.selectKey ? { 'return-object': true } : {};

        return {
            attrs,
            fieldValue: this.value
        };
    }
};
</script>
