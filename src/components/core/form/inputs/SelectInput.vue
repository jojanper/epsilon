<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-autocomplete
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :items="selectlist"
      :placeholder="placeholder"
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
    props: ['placeholder', 'label', 'name', 'value', 'rules', 'selectlist', 'help'],
    data() {
        return {
            fieldValue: this.value
        };
    }
};
</script>
