<template>
  <div
    class="form-wrapper-outer"
    :class="classes"
  >
    <ValidationProvider
      v-slot="{ errors, required }"
      :name="name"
      :rules="rules"
    >
      <div :class="getOutlinedClasses('field-wrapper', errors, required)">
        <div :class="getOutlinedClasses('field-content', errors, required)">
          <v-radio-group
            class="mt-1"
            :class="classes"
            v-model="fieldValue"
            light
            :value="fieldValue"
            :error="isRequiredRadio(required)"
            :label="label"
            :error-messages="errors"
            @change="inputChangeEvent"
          >
            <input-help
              v-if="help"
              slot="append"
              @form-input-help="inputHelpEvent"
            ></input-help>
            <v-radio
              v-for="(item, index) in data"
              :key="index"
              :label="item.label"
              :value="index"
            ></v-radio>
          </v-radio-group>
        </div>
      </div>
    </ValidationProvider>
  </div>
</template>

<script>
import BaseInput from './BaseInput.vue';
import { data } from './options';

export default {
    name: 'RadioInput',
    extends: BaseInput,
    props: { data },
    methods: {
        getInitialValue(value) {
            let output = value;

            // Select default item if such specified when no input value available
            if (value === undefined || value === null || value < 0) {
                for (let i = 0; i < this.data.length; i++) {
                    if (this.data[i].default) {
                        output = i;
                        this.fieldValue = output;
                        this.sendChangeEvent(this.fieldValue);
                        break;
                    }
                }
            }

            return output;
        }
    }
};
</script>

<style scoped lang="scss">
.field-content
{
    .v-input
    {
        padding-bottom: 0px !important;
    }
}
</style>
