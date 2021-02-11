<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-left ml-2">
          <div>
            <div class="float-left expand-title">{{ name }}</div>
            <draal-tooltip-menu
              v-if="exportVal"
              :tooltip-text="editTooltip"
              :menuAttrs="menuAttrs"
              @visibility="sendEditVisibilityEvent"
            >
              <template v-slot:menu-entry="{ menu, tooltip }">
                <v-icon
                  class="ml-1 mt-2"
                  v-bind="exportAttrs"
                  v-on="{ ...menu, ...tooltip}"
                  :color="exportColor"
                >mdi-border-color</v-icon>
              </template>
              <template v-slot:menu-content="{ setVisibility }">
                <v-text-field
                  class="p-3"
                  v-model="name"
                  :label="editLabel"
                  clearable
                  hide-details
                  @input="updateExportName()"
                >
                  <v-btn icon slot="append-outer" @click="setVisibility(false)">
                    <v-icon v-bind="exportAttrs">mdi-check</v-icon>
                  </v-btn>
                </v-text-field>
              </template>
            </draal-tooltip-menu>
          </div>
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-action v-if="deleteActionAttrs" class="mr-0">
        <draal-tooltip v-bind="deleteAttrs" @clicked="deleteEvent()"></draal-tooltip>
      </v-list-item-action>

      <v-list-item-action v-if="exportActionAttrs" class="mr-0">
        <draal-tooltip v-bind="exportAttrs" :icon-color="exportColor" @clicked="exportEvent()"></draal-tooltip>
      </v-list-item-action>

      <div v-if="customSlots.length">
        <v-list-item-action class="mr-0">
          <slot v-for="(slot, index) in customSlots" v-bind:index="index" :name="slot"></slot>
        </v-list-item-action>
      </div>

      <v-list-item-action class="ml-0">
        <v-btn icon>
          <v-icon v-if="!show" :color="menuColor" @click="changeState(true)">{{ menuOpenIcon }}</v-icon>
          <v-icon v-else :color="menuColor" @click="changeState(false)">{{ menuCloseIcon }}</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <div v-show="show">
      <v-expand-transition>
        <!--
          @slot Expanded item content.
        -->
        <slot name="content"></slot>
      </v-expand-transition>
    </div>
  </div>
</template>

<script>
import DraalTooltip from '@/components/core/utils/Tooltip.vue';
import DraalTooltipMenu from '@/components/core/utils/TooltipMenu.vue';

/**
 * Expand item with toolbar.
 *
 * @displayName DraalExpandItem
 */
export default {
    name: 'DraalExpandItem',
    components: {
        DraalTooltip,
        DraalTooltipMenu
    },
    props: {
        /**
         * Item title.
         */
        title: {
            type: String,
            required: true
        },
        /**
         * Expend open menu icon.
         */
        menuOpenIcon: {
            type: String,
            required: false,
            default: 'mdi-menu-down'
        },
        /**
         * Expend open menu icon.
         */
        menuCloseIcon: {
            type: String,
            required: false,
            default: 'mdi-menu-up'
        },
        /**
         * Expend menu menu color.
         */
        menuColor: {
            type: String,
            required: false,
            default: 'grey darken-1'
        },
        /**
         * Include delete action with specified attributes.
         * All draal-tooltip attributes are available.
         */
        deleteActionAttrs: {
            type: Object,
            required: false,
            default: null
        },
        /**
         * Include export action with specified attributes.
         * All draal-tooltip attributes are available.
         */
        exportActionAttrs: {
            type: Object,
            required: false,
            default: null
        },
        /**
         * Number of custom actions.
         */
        customActions: {
            type: Number,
            required: false,
            default: 0
        },
        /**
         * Initial expand state: true for open, false for close.
         */
        value: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Initial item export status
         */
        export: {
            type: Boolean,
            required: false,
            default: false
        },
        /**
         * Edit tooltip text.
         */
        editTooltip: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Label for export data name input.
         */
        editLabel: {
            type: String,
            required: false,
            default: ''
        }
    },
    data() {
        // Prepare required amount of slots
        const customSlots = [];
        for (let i = 0; i < this.customActions; i++) {
            customSlots.push(`action-${i}`);
        }

        const menuAttrs = {
            'close-on-content-click': false,
            'offset-x': true,
            'content-class': 'bg-white',
            'nudge-width': 400
        };

        return {
            show: this.value,
            customSlots,
            deleteAttrs: this.setActionAttrs(this.deleteActionAttrs, 'mdi-delete'),
            exportAttrs: this.setActionAttrs(this.exportActionAttrs, 'mdi-export'),
            exportVal: this.export,
            name: this.title,
            menuAttrs
        };
    },
    watch: {
        value(newVal) {
            if (this.show !== newVal) {
                this.show = newVal;
            }
        }
    },
    computed: {
        exportColor() {
            return this.exportVal ? 'blue' : '';
        }
    },
    methods: {
        changeState(value) {
            this.show = value;

            /**
             * Expand state change.
             *
             * @param value Expand state (true for open, false for close).
             */
            this.$emit('input', this.show);
        },

        // Determine action attributes
        setActionAttrs(inputAttrs, icon) {
            const attr = { ...inputAttrs };

            // Delete icon by default
            if (!attr.icon) {
                attr.icon = icon;
            }

            // Use red color unless something else specified
            if (!attr.iconColor && !attr['icon-color']) {
                attr.iconColor = 'red';
            }

            return attr;
        },

        updateExportName() {
            this.name = this.name || this.title;

            /**
             * Update item export name.
             *
             * @property name Item export name.
             */
            this.$emit('export-name', this.name);
        },

        deleteEvent() {
            /**
             * Request item removal.
             */
            this.$emit('delete');
        },

        exportEvent() {
            this.exportVal = !this.exportVal;

            /**
             * Request item export.
             *
             * @property status Export status, true for requesting export, false when export request removed.
             */
            this.$emit('export', this.exportVal);
        },

        sendEditVisibilityEvent(value) {
            /**
             * Export edit editing status.
             *
             * @property value Editing status (true/false).
             */
            this.$emit('edit', value);
        }
    }
};
</script>
