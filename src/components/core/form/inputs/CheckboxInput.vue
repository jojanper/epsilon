<template>
  <div class="form-wrapper-outer" :class="classes">
    <ValidationProvider v-slot="{ errors, required }" :name="name" :rules="rules">
      <div :class="getOutlinedClasses('field-wrapper', errors, required, 'checkbox')">
        <div
          v-if="outlined"
          :style="getOutlinedStyle()"
          :class="getOutlinedClasses('field-placeholder', errors, required, 'checkbox')"
        >
          <span>
            <v-label>{{ label }}</v-label>
          </span>
        </div>

        <div :class="getOutlinedClasses('field-content', errors, required, 'checkbox')">
          <v-checkbox
            class="classes"
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
        </div>
      </div>
    </ValidationProvider>
  </div>
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
