<template>
  <div class="form-wrapper-outer w-100" :class="classes">
    <ValidationProvider v-slot="{ errors, required }" :name="name" :rules="rules">
      <div :class="getCheckboxClasses('field-wrapper', errors, required)">
        <div v-if="outlined" :class="getCheckboxClasses('field-placeholder', errors, required)">
          <span>
            <v-label>{{ label }}</v-label>
          </span>
        </div>

        <div :class="getCheckboxClasses('field-content', errors, required)">
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
    extends: BaseInput,
    methods: {
        getCheckboxClasses(base, errors, required) {
            const cls = this.outlined ? [base] : [];
            if (errors.length || this.isRequired(required)) {
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
.v-input--selection-controls.v-input .v-label {
    top: 3px;
}

.form-wrapper-outer {
    margin-bottom: 20px;
}

.field-wrapper
{
    position: relative;
    width: 100%;

    .field-content
    {
        //position: relative;

        border-style: solid;
        border-width: 1px;
        border-radius: 8px;
        border-color: currentColor;
        width: 100%;

        /*
        border: 2px solid red;
        margin: calc(16px - 2px);

        padding-top: 5px;
        padding-left: 10px;
        */
        //border: 2px solid red;
        padding: 2px; //calc(16px - 2px);
        padding-left: 15px;

        &:hover
        {
            // content: "";
            // position: absolute;
            //width: 100%;
            //height: 100%;
            // border: 2px solid;
            border-width: 2px;
            //margin: -5px;
            //border: 5px solid red;
            //margin: calc(16px - 5px);
            //border: 2px solid red;
            padding: 1px; //calc(16px - 5px);
            padding-left: 14px;
        }
    }

    .field-placeholder
    {
        position: absolute;
        top: -12px;
        // left: 1%;
        left: 5px;
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
</style>
