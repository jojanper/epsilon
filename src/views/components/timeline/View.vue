<template>
  <div>
    <draal-form-generator
      :schema="schema"
      v-model="formData"
      v-on:submit="submit"
      :options="options"
      :reset="resetField"
    >
      <template v-slot:form.row.timeline2.angleDir="{ data }">
        <v-icon :style="renderAzimuth(data)">mdi-arrow-up</v-icon>
      </template>

      <template v-slot:form.row.timeline2.edit-dialog>
        <v-icon>mdi-arrow-down</v-icon>
      </template>

      <!-- Handle timeline event data editing -->
      <template v-slot:form.timeline.edit-dialog="{ data  }">
        <draal-event-data-edit
          :key="data.source.$id"
          :data="data.source"
          :save="data.save"
        ></draal-event-data-edit>
      </template>

      <!-- Handle timeline event data rendering in the table -->
      <template v-slot:form.timeline.value="{ data }">
        <draal-event-data :data="data"></draal-event-data>
      </template>

      <!-- Create toolbar on the left side of the timeline -->
      <template v-slot:form.timeline.toolbar-left="{ data }">
        <div>
          <!-- Timeline toolbar icons -->
          <draal-tooltip
            v-for="(event, index) in timelineToolbarIcons"
            :key="index"
            classes="ml-2"
            v-bind="toolIconAttrs"
            :name="event.name"
            :icon="event.icon"
            @clicked="iconClick(data, event.value)"
          ></draal-tooltip>
          <!-- Timeline toolbar dropdown menu -->
          <draal-tooltip-menu
            v-if="menuPresets.length > 0"
            tooltip-text="More event presets"
            :tooltip-attrs="{ position: toolIconAttrs.position }"
            :menuItems="menuPresets"
            :cb-data="data"
            :menuAttrs="{ left: true, 'offset-y': true }"
          >
            <template v-slot:menu-entry="{ menu, tooltip }">
              <v-icon
                class="float-right"
                v-bind="menuAttrs"
                v-on="{ ...menu, ...tooltip}"
              >mdi-menu</v-icon>
            </template>
          </draal-tooltip-menu>
        </div>
      </template>

      <!-- Customize toolbar on the right side of the timeline -->
      <template v-slot:form.timeline.toolbar-right.add="{ data }">
        <!-- Add new direction event -->
        <draal-tooltip
          v-bind="toolIconAttrs"
          :name="$t('configuratorPage.newDirection')"
          icon="mdi-focus-field"
          @clicked="addEvent(data, timelineTypes.dir)"
        ></draal-tooltip>
        <!-- Add new switch event -->
        <draal-tooltip
          v-bind="toolIconAttrs"
          :name="$t('configuratorPage.newSwitch')"
          icon="mdi-fan"
          @clicked="addEvent(data, timelineTypes.switch)"
        ></draal-tooltip>
      </template>
    </draal-form-generator>
  </div>
</template>

<script>
import { SCHEMA, TIMELINE_TYPES } from './schema';
import DraalEventData from './EventData.vue';
import DraalEventDataEdit from './EventDataEdit.vue';
import { configuratorMixin } from '../mixin';

import { initDataFromSchema } from '@/components/core/form/input';
import DraalFormGenerator from '@/components/core/form/Form.vue';
import DraalTooltip from '@/components/core/utils/Tooltip.vue';
import DraalTooltipMenu from '@/components/core/utils/TooltipMenu.vue';

export default {
    name: 'DraalAppConfiguratorTab5',
    mixins: [configuratorMixin],
    components: {
        DraalFormGenerator,
        DraalTooltip,
        DraalTooltipMenu,
        DraalEventData,
        DraalEventDataEdit
    },
    data() {
        const schema = [...SCHEMA];
        this.setSchemaCallbacks(schema);

        return {
            timelineTypes: TIMELINE_TYPES,

            data: null,
            formData: initDataFromSchema(schema),
            schema,

            fileDialog: false,

            timelineToolbarIcons: [
                {
                    name: 'Left',
                    icon: 'mdi-pan-left',
                    value: 90
                },
                {
                    name: 'Front',
                    icon: 'mdi-pan-up',
                    value: 0
                },
                {
                    name: 'Back',
                    icon: 'mdi-pan-down',
                    value: 180
                },
                {
                    name: 'Right',
                    icon: 'mdi-pan-left',
                    value: -90
                }
            ],

            menuPresets: [
                {
                    title: 'Preset 1',
                    fn: data => {
                        this.iconClick(data, 140);
                    }
                }
            ],
            menuAttrs: {
                large: true
            }
        };
    },
    methods: {
        resetField(field) {
            if (field === 'windscreen') {
                return false;
            }

            return undefined;
        },

        renderAzimuth(data) {
            return `transform: rotate(${-data.angle}deg)`;
        },

        iconClick({ add }, angle) {
            const type = this.timelineTypes.dir;
            const zoom = 90;
            add(5, (position, maxPos, index, cb) => {
                cb({
                    angle, zoom, position: position + index * 0.5, type
                });
            });
        },

        addEvent({ add }, type = TIMELINE_TYPES.dir) {
            add(null, null, type);
        }
    }
};
</script>
