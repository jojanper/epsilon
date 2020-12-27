<template>
  <ValidationProvider v-slot="{ errors }" :name="name" :rules="rules">
    <v-text-field
      :class="classes"
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

import BaseInput from './BaseInput.vue';
import InputHelp from './InputHelp.vue';

export default {
    name: 'TextInput',
    extends: BaseInput,
    components: {
        InputHelp,
        ValidationProvider
    }
};
</script>
