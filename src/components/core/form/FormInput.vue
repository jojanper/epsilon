<template>
  <div>
    <div
      v-if="$attrs.dividerStart"
      class="clearfix"
    >
      <hr
        :data-content="$attrs.dividerStart.label"
        class="form-input-divider mx-auto"
        :class="$attrs.dividerStart.label ? `f-div-input ${$attrs.dividerStart.class}` :
          `hr-simple-text ${$attrs.dividerStart.class}`"
        :style="$attrs.dividerStart.style"
      />
    </div>

    <component
      :is="getType($attrs.type)"
      v-bind="$attrs"
      v-on="$listeners"
      :data-rel-input="dataRel.asPipe()"
    >
      <template
        v-for="(def, index) in slotsDef"
        v-slot:[def.childSlot]="{ data }"
      >
        <!--
        @slot Custom input data rendering.
        @binding {number} inputKey Input key (Vue key attribute).
        @binding {object} data Input data.
        -->
        <slot
          :name="def.componentSlot"
          v-bind:inputKey="index"
          v-bind:data="data"
        ></slot>
      </template>
    </component>

    <div
      v-if="$attrs.dividerEnd"
      class="clearfix"
    >
      <hr
        :data-content="$attrs.dividerEnd.label"
        class="form-input-divider mx-auto"
        :class="$attrs.dividerEnd.label ? `f-div-input ${$attrs.dividerEnd.class}` : `hr-simple-text ${$attrs.dividerEnd.class}`"
        :style="$attrs.dividerEnd.style"
      />
    </div>
  </div>
</template>

<script>
import { getFormInputName } from './input';
import TextInput from './inputs/TextInput.vue';
import SelectInput from './inputs/SelectInput.vue';
import CheckboxInput from './inputs/CheckboxInput.vue';
import SwitchInput from './inputs/SwitchInput.vue';
import RadioInput from './inputs/RadioInput.vue';
import FileOpenInput from './inputs/FileOpenInput.vue';
import LocalAudioFileInput from './inputs/LocalAudioFileInput.vue';
import RemoteFileSaveInput from './inputs/RemoteFileSaveInput.vue';
import FileQueryInput from './inputs/FileQueryInput.vue';
import TimelineInput from './inputs/TimelineInput.vue';
import GroupInput from './GroupInput.vue';
import { BaseObservableObject, slotMapping } from '@/common/utils';

/**
 * Form input wrapper.
 *
 * @displayName DraalFormInput
 */
export default {
    name: 'DraalFormInput',
    components: {
        TextInput,
        SelectInput,
        CheckboxInput,
        SwitchInput,
        RadioInput,
        TimelineInput,
        FileOpenInput,
        RemoteFileSaveInput,
        LocalAudioFileInput,
        FileQueryInput,
        GroupInput
    },
    data() {
        return {
            // Data changes from other inputs are communicated via Subject
            dataRel: BaseObservableObject.createAsSubject(),
            slotsDef: this.getSlots()
        };
    },
    mounted() {
        if (this.$attrs.dataRelTarget && this.$attrs.dataRelTarget.length) {
            /**
             * Request data notifications from related input components
             *
             * @param name Input requestor.
             * @param targets Requested inputs from related input components.
             * @param cb Callback for data updates.
             */
            this.$emit('data-rel-update',
                this.$attrs.name,
                this.$attrs.dataRelTarget,
                this.dataUpdate.bind(this));
        }
    },
    destroyed() {
        // No more events emitted from object
        this.dataRel.close();
    },
    methods: {
        getSlots() {
            const { name } = this.$attrs;
            const prefix = this.$attrs.slotPrefix || '';
            const colDef = this.$attrs.customSlots || [];
            const slots = colDef.map(column => ({
                childSlot: `${prefix}${name}.${column}`,
                componentSlot: `input.${prefix}${name}.${column}`
            }));

            // In case this input is group in, locate all slots under the group schema.
            // Otherwise the child to parent slot mapping will be incomplete
            if (this.$attrs.schema) {
                // The input components expose the slots with 'input' prefix
                // and the parent component (group input) will also expose
                // its own slots using the same name. This is because group input
                // is just a thin rendering wrapper between form input and the
                // actual input component implementation.
                slotMapping(slots, this.$attrs.schema, `${name}.`, 'input', 'input');
            }

            return slots;
        },

        // Map form input type into internal component name
        getType(type) {
            return getFormInputName(type);
        },

        // Data was updated in related input component, send the changed value(s) to child
        dataUpdate(target, data) {
            this.dataRel.send({ target, data });
        }
    }
};
</script>

<style lang="scss" scoped>
hr {
    position: relative;
    top: 5px;

    .f-div-input, .hr-simple-text {
        position: relative;
        border: none;
        height: 1px;
        background: #999;
    }
}

hr.f-div-input::after {
    content: attr(data-content);
    display: inline-block;
    background: #fff;
    font-weight: bold;
    font-size: 0.85rem;
    color: #999;
    border-radius: 30rem;
    padding: 0.2rem 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
