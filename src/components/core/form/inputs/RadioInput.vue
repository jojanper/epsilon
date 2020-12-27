<template>
  <ValidationProvider v-slot="{ errors, required }" :name="name" :rules="rules">
    <v-radio-group
      :class="classes"
      v-model="fieldValue"
      light
      :value="fieldValue"
      :error="isRequiredRadio(required)"
      :label="label"
      :error-messages="errors"
      @change="$emit('input', fieldValue)"
    >
      <input-help v-if="help" slot="append" @form-input-help="inputHelpEvent"></input-help>
      <v-radio v-for="(item, index) in data" :key="index" :label="item.label" :value="index"></v-radio>
    </v-radio-group>
  </ValidationProvider>
</template>

<script>
import BaseInput from './BaseInput.vue';
import { data } from './options';

export default {
    name: 'RadioInput',
    extends: BaseInput,
    props: { data }
};
</script>
