<template>
  <div>
    <div v-if="event.isOnOff">
      <v-card-text class="p-0">
        <switch-input
          class="ml-4 mb-0"
          classes
          placeholder
          name
          :value="event.data.value"
          label
          :display="onOffDisplay"
          @input="(input) => save({ value: input })"
        ></switch-input>
      </v-card-text>
    </div>
    <wheel-input
      v-if="event.isDirection"
      name
      label
      placeholder
      :value="event.data"
      :zoomtransform="1"
      @input="(input) => save(input)"
    ></wheel-input>
  </div>
</template>

<script>
import { eventDataMixin } from './eventDataMixin';

import SwitchInput from '@/components/core/form/inputs/SwitchInput.vue';
import WheelInput from '@/components/core/form/inputs/WheelInput.vue';

export default {
    mixins: [eventDataMixin],
    components: {
        SwitchInput,
        WheelInput
    },
    props: {
        /**
         * Event data saving function.
         */
        save: {
            type: Function,
            required: false
        }
    }
};
</script>
