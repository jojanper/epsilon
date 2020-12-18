<template>
  <ValidationProvider v-slot="{ errors, required }" :name="name" :rules="rules">
    <v-radio-group
      v-model="fieldValue"
      light
      :value="fieldValue"
      :error="isRequired(required)"
      :label="label"
      :error-messages="errors"
      @change="$emit('input', fieldValue)"
    >
      <v-icon
        slot="append"
        v-if="help"
        @click="$emit('form-input-help', name)"
      >mdi-information-outline</v-icon>
      <v-radio v-for="(item, index) in data" :key="index" :label="item.label" :value="index"></v-radio>
    </v-radio-group>
  </ValidationProvider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

export default {
    name: 'RadioInput',
    components: {
        ValidationProvider
    },
    props: ['label', 'data', 'name', 'value', 'rules', 'help'],
    data() {
        return {
            fieldValue: this.value
        };
    },
    methods: {
        isRequired(required) {
            return required ? this.fieldValue === null : false;
        }
    }
};
</script>
