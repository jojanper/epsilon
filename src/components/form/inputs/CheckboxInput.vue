<template>
  <ValidationProvider :name="name" :rules="rules">
    <v-checkbox v-model="fieldValue" light :label="label" @change="$emit('input', fieldValue)">
      <v-icon slot="append" @click="$emit('form-input-help', name)">mdi-information-outline</v-icon>
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
    props: ['label', 'name', 'value', 'rules'],
    data() {
        return {
            fieldValue: this.value
        };
    }
};
</script>

<style lang="scss">
.v-input--selection-controls.v-input .v-label {
    top: 3px;
}
</style>
