<template>
  <div class="pb-3">
    <div class="pr-3 mr-3">
      <p class="text-left v-label theme--light">{{ label }}</p>
    </div>

    <div class="pl-3 pr-3 border rounded">
      <div class="p-3">
        <!-- Validation via hidden input -->
        <ValidationProvider rules="required">
          <input class="d-none" type="number" v-model="dummyModel" />
        </ValidationProvider>

        <!-- Input gets invalid every time timeline changes -->
        <draal-timeline
          class="mr-3"
          :timeData="value"
          :timelineWidths="timelineWidths"
          :itemCreator="newTimeline"
          @input="saveTimeline"
          @timelineChanged="dummyModel=null"
          :tableConfig="tableConfig"
          :maxZoom="maxZoom"
        >
          <!-- Custom column rendering -->
          <!-- Show direction as arrow pointing to correct direction -->
          <template v-slot:table.angleDir="{ data }">
            <v-icon :style="renderAzimuth(data)">mdi-arrow-up</v-icon>
          </template>

          <!-- Row data editing occurs here -->
          <template v-slot:editDialog="{ componentKey, editData, editChanges }">
            <wheel-input
              :key="componentKey"
              :value="editData"
              zoomtransform="1"
              @input="(data) => saveEditedValues(editData, data, editChanges)"
            ></wheel-input>
          </template>
        </draal-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';

import WheelInput from './WheelInput.vue';
import DraalTimeline from '../../timeline/Timeline.vue';

const HEADERS = [
    {
        text: 'Event position',
        align: 'left',
        filterable: false,
        sortable: false,
        value: 'position'
    },
    {
        text: 'Direction',
        value: 'angleDir',
        sortable: false,
        filterable: false
    },
    {
        text: 'Angle',
        value: 'angle',
        sortable: false,
        filterable: false
    },
    {
        text: 'Zoom %',
        value: 'zoom',
        sortable: false,
        filterable: false
    }
];

export default {
    name: 'FocusTimeline',
    components: {
        DraalTimeline,
        WheelInput,
        ValidationProvider
    },
    props: ['name', 'label', 'timelineWidths', 'value', 'maxZoom'],
    data() {
        return {
            // Changes in timeline are tracked via hidden input validation.
            // Change event from timeline component will make this component invalid
            // and user is explicitly required to save the timeline changes before
            // component validation succeeds.
            dummyModel: 0,

            tableConfig: {
                // Custom rendering via template slot is provided for this data item
                customColumns: ['angleDir'],
                headers: HEADERS,
                actions: ['edit', 'delete'],
                actionsConfig: {
                    name: 'Actions'
                }
            }
        };
    },
    mounted() {
        this.$emit('input-handle-registration', this.name, data => {
            console.log(data);
        });
    },
    methods: {
        saveEditedValues(source, data, editChanges) {
            /* eslint-disable no-param-reassign */
            source.angle = data.angle;
            source.zoom = data.zoom;
            editChanges(true);
            /* eslint-enable no-param-reassign */
        },

        newTimeline() {
            return {
                angle: 0,
                zoom: 0
            };
        },

        // Timeline changes are saved which validates also the component input
        saveTimeline(timeline) {
            this.$emit('input', timeline);
            this.dummyModel = 0;
        },

        renderAzimuth(data) {
            return `transform: rotate(${-data.angle}deg)`;
        }
    }
};
</script>
