<template>
  <component
    :is="getType($attrs.type)"
    v-bind="$attrs"
    v-on="$listeners"
    :data-rel-input="dataRel.asPipe()"
  >
    <template v-for="(columnDef, index) in customRender" v-slot:[columnDef.column]="{ data }">
      <!--
        @slot Custom input data rendering.
        @binding {number} inputKey Input key (Vue key attribute).
        @binding {object} data Input data.
      -->
      <slot :name="columnDef.name" v-bind:inputKey="index" v-bind:data="data"></slot>
    </template>
    <template v-slot:focusTimeline.angleDir2>FORM INPUT COMPONENT</template>
  </component>
</template>

<script>
import { BaseObservableObject } from '@/common/utils';

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
            const colDef = this.$attrs.customSlots || [];

            const t = colDef.map(column => ({ column: `${name}.${column}`, name: `input.${name}.${column}` }));

            console.log(t);
            return t;
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
