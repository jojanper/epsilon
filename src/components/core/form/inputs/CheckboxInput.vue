<template>
  <ValidationProvider v-slot="{ errors, required }" :name="name" :rules="rules">
    <v-checkbox
      class="form-input mt-0 pt-0 pb-2"
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

export default {
    name: 'CheckboxInput',
    components: {
        ValidationProvider
    },
    props: ['label', 'name', 'value', 'rules', 'help'],
    data() {
        return {
            fieldValue: this.value
        };
    },
    methods: {
        isRequired(required) {
            return required ? !this.fieldValue : false;
        }
    }
};
</script>

<style lang="scss">
.v-input--selection-controls.v-input .v-label {
    top: 3px;
}
</style>
