<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-text-field
      class="form-input mt-0 pt-0 pb-2"
      v-model="fieldValue"
      :error-messages="errors"
      :label="label"
      :placeholder="placeholder"
      @input="$emit('input', fieldValue)"
    >
      <input-help v-if="help" slot="append-outer" @form-input-help="$emit('form-input-help', name)"></input-help>
    </v-text-field>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

import InputHelp from './InputHelp.vue';

export default {
    name: 'TextInput',
    components: {
        InputHelp,
        ValidationProvider
    },
    props: ['placeholder', 'label', 'name', 'value', 'rules', 'help'],
    data() {
        return {
            fieldValue: this.value
        };
    }
};
</script>
