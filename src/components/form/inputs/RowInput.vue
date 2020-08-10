<template>
  <div class="row mt-0">
    <div class="ml-auto col-sm pt-0" v-for="(field, index) in schema" :key="index">
      <component
        :key="index"
        :is="field.fieldType"
        :value="value[field.name]"
        @input="updateForm(field.name, $event)"
        v-bind="field"
        @form-input-help="inputHelp"
      ></component>
    </div>
    <div class="col-sm">&nbsp;</div>
  </div>
</template>

<script>
import CheckboxInput from './CheckboxInput.vue';
import WheelInput from './WheelInput.vue';

export default {
    name: 'RowInput',
    components: {
        CheckboxInput,
        WheelInput
    },
    props: ['schema', 'value', 'name'],
    methods: {
        updateForm(fieldName, value) {
            this.$set(this.value, fieldName, value);
            this.$emit('input', this.value);
        },

        inputHelp(name) {
            this.$emit('form-input-help', `${this.name}.${name}`);
        }
    }
};
</script>
