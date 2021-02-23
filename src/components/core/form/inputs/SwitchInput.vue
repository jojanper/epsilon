<template>
  <div class="form-wrapper-outer" :class="classes">
    <ValidationProvider v-slot="{ errors, required }" :name="name" :rules="rules">
      <div :class="getOutlinedClasses('field-wrapper', errors, required)">
        <div :class="getOutlinedClasses('field-content', errors, required)">
          <v-switch
            class="draal-switch"
            :class="classes"
            v-model="fieldValue"
            light
            :value="fieldValue"
            :label="display[fieldValue ? 1 : 0]"
            :error-messages="errors"
            @change="inputChangeEvent"
          >
            <input-help v-if="help" slot="append" @form-input-help="inputHelpEvent"></input-help>
          </v-switch>
        </div>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import BaseInput from './BaseInput.vue';

export default {
    name: 'SwitchInput',
    extends: BaseInput,
    props: {
        /**
         * Display values for disabled (array index 0) and enabled (array index 1) states.
         */
        display: {
            type: Array,
            required: true
        }
    }
};
</script>

<style scoped lang="scss">
.field-content
{
    .draal-switch {
        margin-top: 15px !important;
    }

    .v-input
    {
        padding-bottom: 0px !important;
    }
}
</style>
