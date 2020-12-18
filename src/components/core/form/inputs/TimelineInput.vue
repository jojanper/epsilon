<template>
  <div>
    <div class="pr-3 mr-3 mt-3">
      <p class="text-left v-label theme--light">{{ label }}</p>
    </div>

    <div class="border rounded">
      <div class="p-4">
        <!-- Validation via hidden input -->
        <ValidationProvider rules="required">
          <input class="d-none" type="number" v-model="dummyModel" />
        </ValidationProvider>

        <!-- Input gets invalid every time timeline changes -->
        <draal-timeline
          :timeData="value"
          :timelineWidths="timelineWidths"
          :itemCreator="accessMethods.new"
          @input="saveTimeline"
          @timelineChanged="dummyModel=null"
          :tableConfig="tableConfig"
          :maxZoom="maxZoom"
          :data-provider="dataRelInput"
        >
          <template v-for="(columnDef, index) in customRender" v-slot:[columnDef.column]="{ data }">
            <!--
              @slot Custom table column data rendering.
              @binding {number} columnKey Column key (Vue key attribute).
              @binding {object} data Column data.
            -->
            <slot :name="columnDef.name" v-bind:inputKey="index" v-bind:data="data"></slot>
          </template>

          <!-- Custom column rendering -->
          <!-- Show direction as arrow pointing to correct direction -->
          <!--template v-slot:table.angleDir="{ data }">
            <v-icon :style="renderAzimuth(data)">mdi-arrow-up</v-icon>
          </template-->

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

export default {
    name: 'FocusTimeline',
    components: {
        DraalTimeline,
        WheelInput,
        ValidationProvider
    },
    props: ['name', 'label', 'timelineWidths', 'value', 'maxZoom', 'dataRelInput', 'tableConfig', 'accessMethods', 'customSlots'],
    data() {
        return {
            // Changes in timeline are tracked via hidden input validation.
            // Change event from timeline component will make this component invalid
            // and user is explicitly required to save the timeline changes before
            // component validation succeeds.
            dummyModel: 0
        };
    },
    computed: {
        customRender() {
            const colDef = this.customSlots || [];
            const t = colDef.map(column => ({ column: `table.${column}`, name: `${this.name}.${column}` }));

            console.log(t);
            return t;
        }
    },
    methods: {
        saveEditedValues(source, data, editChanges) {
            this.accessMethods.save(source, data);
            editChanges(true);
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
