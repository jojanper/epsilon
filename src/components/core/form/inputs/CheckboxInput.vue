<template>
  <ValidationProvider v-slot="{ errors, required }" :name="name" :rules="rules">
    <v-checkbox
      :class="classes"
      v-model="fieldValue"
      light
      :error="isRequired(required)"
      :value="fieldValue"
      :label="label"
      :error-messages="errors"
      @change="$emit('input', fieldValue)"
    >
      <v-icon
        slot="append"
        v-if="help"
        @click="$emit('form-input-help', name)"
      >mdi-information-outline</v-icon>
    </v-checkbox>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

import BaseInput from './BaseInput.vue';

export default {
    name: 'CheckboxInput',
    extends: BaseInput,
    components: {
        ValidationProvider
    }
};
</script>

<style lang="scss">
.v-input--selection-controls.v-input .v-label {
    top: 3px;
}
</style>
