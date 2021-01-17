<template>
  <div class="form-wrapper-outer w-100" :class="classes">
    <ValidationProvider v-slot="{ errors, required }" :name="name" :rules="rules">
      <div :class="getRadioClasses('field-wrapper', errors, required)">
        <div v-if="outlined" :class="getRadioClasses('field-placeholder', errors, required)">
          <span>
            <v-label>{{ label }}</v-label>
          </span>
        </div>
        <div :class="getRadioClasses('field-content', errors, required)">
          <v-radio-group
            :class="classes"
            v-model="fieldValue"
            light
            :value="fieldValue"
            :error="isRequiredRadio(required)"
            :label="label"
            :error-messages="errors"
            @change="inputChangeEvent"
          >
            <input-help v-if="help" slot="append" @form-input-help="inputHelpEvent"></input-help>
            <v-radio v-for="(item, index) in data" :key="index" :label="item.label" :value="index"></v-radio>
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
        getRadioClasses(base, errors, required) {
            const cls = this.outlined ? [base] : [];
            if (errors.length || this.isRequiredRadio(required)) {
                cls.push('error--text');
            } else {
                cls.push('primary--text');
            }

            return cls;
        }
    }
};
</script>

<style lang="scss">
/*
.form-wrapper-outer {
    margin-bottom: 15px;
}

.field-wrapper
{
    position: relative;
    width: 100%;

    .field-content
    {
        border: 1px solid;
        border-radius: 8px;
        border-color: currentColor;
        width: 100%;

        padding-top: 10px;
        padding-left: 10px;

        &:hover
        {
            border: 2px solid;
        }

        .v-input {
            padding-bottom: 0px !important;
        }
    }

    .field-placeholder
    {
        position: absolute;
        top: -12px;
        left: 50%;
        box-sizing: border-box;
        padding: 0 6px;
        z-index: 1;
        text-align: left;

        span
        {
            background: #ffffff;
            padding: 0px 6px;
        }

        label {
            font-size: 13px !important;
            color: currentColor;
        }
    }
}
*/
</style>
