<template>
  <component
    :is="getType($attrs.type)"
    v-bind="$attrs"
    v-on="$listeners"
    :data-rel-input="dataRel.asPipe()"
  >
    <template v-for="(def, index) in customRender" v-slot:[def.childSlot]="{ data }">
      <!--
        @slot Custom input data rendering.
        @binding {number} inputKey Input key (Vue key attribute).
        @binding {object} data Input data.
      -->
      <slot :name="def.componentSlot" v-bind:inputKey="index" v-bind:data="data"></slot>
    </template>
  </component>
</template>

<script>
import { BaseObservableObject, slotMapping } from '@/common/utils';

import { getFormInputName } from './input';
import TextInput from './inputs/TextInput.vue';
import SelectInput from './inputs/SelectInput.vue';
import CheckboxInput from './inputs/CheckboxInput.vue';
import RadioInput from './inputs/RadioInput.vue';
import FileOpenInput from './inputs/FileOpenInput.vue';
import RemoteFileSaveInput from './inputs/RemoteFileSaveInput.vue';
import FileQueryInput from './inputs/FileQueryInput.vue';
import TimelineInput from './inputs/TimelineInput.vue';
import GroupInput from './GroupInput.vue';

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
        RadioInput,
        TimelineInput,
        FileOpenInput,
        RemoteFileSaveInput,
        FileQueryInput,
        GroupInput
    },
    data() {
        return {
            // Data changes from other inputs are communicated via Subject
            dataRel: BaseObservableObject.createAsSubject()
        };
    },
    mounted() {
        if (this.$attrs.dataRelTarget) {
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
    computed: {
        customRender() {
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
        }
    },
    destroyed() {
        // No more events emitted from object
        this.dataRel.close();
    },
    methods: {
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
