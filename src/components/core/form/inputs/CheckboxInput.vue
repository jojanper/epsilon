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
      @change="inputChangeEvent"
    >
      <input-help v-if="help" slot="append" @form-input-help="inputHelpEvent"></input-help>
    </v-checkbox>
  </ValidationProvider>
</template>

<script>
import BaseInput from './BaseInput.vue';

export default {
    name: 'CheckboxInput',
    extends: BaseInput
};
</script>

<style lang="scss">
.v-input--selection-controls.v-input .v-label {
    top: 3px;
}
</style>
