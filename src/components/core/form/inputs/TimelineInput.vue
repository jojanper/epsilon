<template>
  <div class="form-wrapper-outer" :class="classes">
    <div :class="getOutlinedClasses('field-wrapper')">
      <div class="clearfix" v-if="!outlined">
        <div class="float-left pl-0">
          <v-label>{{ label }}</v-label>
        </div>
      </div>
      <div v-else :style="getOutlinedStyle()" :class="getOutlinedClasses('field-placeholder')">
        <span>
          <v-label>{{ label }}</v-label>
        </span>
      </div>
      <div :class="getOutlinedClasses('field-content')">
        <div class="timeline-content">
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
            :customSlots="customSlots"
            :toolbarIconSize="toolbarIconSize"
            :help="help"
            @help="$emit('form-input-help', name)"
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
              <!--
                @slot Edit timeline data.
              -->
              <slot
                :name="editSlot"
                v-bind:componentKey="componentKey"
                v-bind:editData="editData"
                v-bind:editChanges="editChanges"
              >
                <wheel-input
                  :key="componentKey"
                  name
                  label
                  placeholder
                  :value="editData"
                  :zoomtransform="1"
                  @input="(data) => saveEditedValues(editData, data, editChanges)"
                ></wheel-input>
              </slot>
            </template>
          </draal-timeline>
        </div>
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
        },
        /**
         * Toolbar icon sizes.
         */
        toolbarIconSize: {
            type: String,
            required: false,
            default: 'medium'
        }
    },
    data() {
        const editSlot = this.getComponentSlotName(this.slotPrefix || '', 'edit-dialog');

        return {
            // Changes in timeline are tracked via hidden input validation.
            // Change event from timeline component will make this component invalid
            // and user is explicitly required to save the timeline changes before
            // component validation succeeds.
            dummyModel: 0,

            editSlot
        };
    },
    computed: {
        customRender() {
            const colDef = this.customSlots || [];
            const prefix = this.slotPrefix || '';
            return colDef.map(column => ({
                childSlot: `table.${column}`,
                componentSlot: this.getComponentSlotName(prefix, column)
            }));
        }
    },
    methods: {
        getComponentSlotName(prefix, slotName) {
            return `${prefix}${this.name}.${slotName}`;
        },

        saveEditedValues(source, data, editChanges) {
            this.accessMethods.save(source, data);
            editChanges(true);
        },

        // Timeline changes are saved which validates also the component input
        saveTimeline(timeline) {
            this.inputChangeEvent(timeline);
            this.dummyModel = 0;
        },

        getOutlinedClasses(base) {
            return this.outlined ? [base, 'primary--text'] : ['primary--text'];
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.timeline-content
{
    padding: 10px;
    padding-right: 25px;
    padding-bottom: 25px;
}
</style>
