<template>
  <div class="form-wrapper-outer" :class="classes">
    <div :class="[outlined ? 'field-wrapper' : '']">
      <div class="clearfix" v-if="!outlined">
        <div class="float-left pl-0">
          <v-label>{{ label }}</v-label>
        </div>
      </div>
      <div :class="[`p-4`, outlined ? 'field-content' : '']">
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
          <template v-for="(def, index) in customRender" v-slot:[def.childSlot]="{ data }">
            <!--
              @slot Custom table column data rendering.
              @binding {number} inputKey Column index (Vue key attribute).
              @binding {object} data Column data.
            -->
            <slot :name="def.componentSlot" v-bind:inputKey="index" v-bind:data="data"></slot>
          </template>

          <!-- Row data editing occurs here -->
          <template v-slot:editDialog="{ componentKey, editData, editChanges }">
            <wheel-input
              :key="componentKey"
              name
              label
              placeholder
              :value="editData"
              :zoomtransform="1"
              @input="(data) => saveEditedValues(editData, data, editChanges)"
            ></wheel-input>
          </template>
        </draal-timeline>
      </div>
      <div v-if="outlined" class="field-placeholder">
        <span>
          <v-label>{{ label }}</v-label>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from './BaseInput.vue';
import WheelInput from './WheelInput.vue';
import DraalTimeline from '../../timeline/Timeline.vue';

export default {
    name: 'TimelineInput',
    extends: BaseInput,
    components: {
        DraalTimeline,
        WheelInput
    },
    props: {
        /**
         * Timeline widths for manually selecting the timelline length. Each item
         * must contain 'width' and 'title' fields.
         */
        timelineWidths: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Maximum numer of zoom levels.
         */
        maxZoom: {
            type: Number,
            required: false,
            default: 10
        },
        /**
         * Data relation observable for providing updates from other form inputs.
         */
        dataRelInput: {
            type: Object,
            required: false,
            default: null
        },
        /**
         * Timeline data table configuration.
         */
        tableConfig: {
            type: Object,
            required: false,
            default: () => {}
        },
        /**
         * Access methods for creating and modifying timeline items. Must
         * include 'new' and 'save' functions.
         */
        accessMethods: {
            type: Object,
            required: true
        },
        /**
         * Custom slots that the component should offer for parent.
         */
        customSlots: {
            type: Array,
            required: false,
            default: () => []
        },
        /**
         * Slot prefix used for custom slots.
         */
        slotPrefix: {
            type: String,
            required: false,
            default: ''
        }
    },
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
            const prefix = this.slotPrefix || '';
            return colDef.map(column => ({ childSlot: `table.${column}`, componentSlot: `${prefix}${this.name}.${column}` }));
        }
    },
    methods: {
        saveEditedValues(source, data, editChanges) {
            this.accessMethods.save(source, data);
            editChanges(true);
        },

        // Timeline changes are saved which validates also the component input
        saveTimeline(timeline) {
            this.inputChangeEvent(timeline);
            this.dummyModel = 0;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.field-wrapper
{
    position: relative;

    .field-content
    {
        border: 1px solid #DADCE0;
        border-radius: 4px;

        &:hover
        {
            border: 1px solid #1A73E8;
        }
    }

    &:hover
    {
        label
        {
            color:#1A73E8;
        }
    }

    .field-placeholder
    {
        position: absolute;
        top: -10px;
        box-sizing: border-box;
        padding: 0 8px;
        z-index: 1;
        text-align: left;

        span
        {
            background: #ffffff;
            padding: 0px 8px;
        }
    }
}
</style>
