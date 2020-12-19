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

    <template v-slot:group.row.focusTimeline2.angleDir2>FORM INPUT {{ $attrs.slotPrefix }}</template>
    <template v-slot:input.row.focusTimeline2.angleDir2>FORM INPUT 2 {{ $attrs.slotPrefix }}</template>

    <!--template v-slot:input.row.focusTimeline2.angleDir>
      <slot name="input.row.focusTimeline2.angleDir"></slot>
    </template-->
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
        // console.log(this.$attrs);
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
            function slotMapping(inputSlots, schema, prefix) {
                // console.log(schema);
                schema.forEach(entry => {
                    if (entry.schema && entry.schema.length) {
                        slotMapping(inputSlots, entry.schema, `${prefix}${entry.name}.`/* `group.${prefix}${entry.name}.` */);
                    } else {
                        const slots = entry.customSlots || [];
                        slots.forEach(column => inputSlots.push({
                            column: `input.${prefix}${entry.name}.${column}`,
                            name: `input.${prefix}${entry.name}.${column}`
                        }));
                    }
                });
            }

            const { name } = this.$attrs;
            const prefix = this.$attrs.slotPrefix || '';
            const colDef = this.$attrs.customSlots || [];
            const t = colDef.map(column => ({
                column: `${prefix}${name}.${column}`,
                name: `input.${prefix}${name}.${column}`
            }));

            const tt = [];
            if (this.$attrs.schema) {
                slotMapping(tt, this.$attrs.schema, `${name}.`);
            }

            const r = tt.concat(t);

            console.log('FORM INPUT', this.$attrs.name, prefix, r, this.$attrs);
            return r;
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
