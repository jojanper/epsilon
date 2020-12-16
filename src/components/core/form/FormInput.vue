<template>
  <component
    :is="getType($attrs.type)"
    v-bind="$attrs"
    v-on="$listeners"
    :data-rel-input="dataRel.asPipe()"
  ></component>
</template>

<script>
import { BaseObservableObject } from '@/common/utils';

import { getFormInputName } from './input';
import TextInput from './inputs/TextInput.vue';
import SelectInput from './inputs/SelectInput.vue';
import CheckboxInput from './inputs/CheckboxInput.vue';
import FileOpenInput from './inputs/FileOpenInput.vue';
import RemoteFileSaveInput from './inputs/RemoteFileSaveInput.vue';
import WheelInput from './inputs/WheelInput.vue';
import FileQueryInput from './inputs/FileQueryInput.vue';
import FocusTimeline from './inputs/FocusTimeline.vue';
import RowInput from './inputs/RowInput.vue';

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
        WheelInput,
        FocusTimeline,
        RowInput,
        FileOpenInput,
        RemoteFileSaveInput,
        FileQueryInput
    },
    data() {
        return {
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
    destroyed() {
        this.dataRel.close();
    },
    methods: {
        getType(type) {
            return getFormInputName(type);
        },

        dataUpdate(target, data) {
            this.dataRel.send({ target, data });
        }
    }
};
</script>
