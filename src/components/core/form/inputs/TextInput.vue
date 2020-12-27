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
      <input-help v-if="help" slot="append-outer" @form-input-help="inputHelpEvent"></input-help>
    </v-text-field>
  </ValidationProvider>
</template>

<script>
import BaseInput from './BaseInput.vue';

export default {
    name: 'TextInput',
    extends: BaseInput
};
</script>
