<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-left ml-2" v-text="title"></v-list-item-title>
      </v-list-item-content>

      <v-list-item-action v-if="deleteActionAttrs" class="mr-0">
        <draal-tooltip v-bind="deleteAttrs" @clicked="deleteEvent()"></draal-tooltip>
      </v-list-item-action>

      <div v-if="customSlots.length">
        <v-list-item-action class="mr-0">
          <slot v-for="(slot, index) in customSlots" v-bind:index="index" :name="slot"></slot>
        </v-list-item-action>
      </div>

      <v-list-item-action class="ml-0">
        <v-btn icon>
          <v-icon v-if="!show" :color="menuColor" @click="show = !show">{{ menuOpenIcon }}</v-icon>
          <v-icon v-else :color="menuColor" @click="show = !show">{{ menuCloseIcon }}</v-icon>
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

/**
 * Expand item with toolbar.
 *
 * @displayName DraalExpandItem
 */
export default {
    name: 'DraalExpandItem',
    components: {
        DraalTooltip
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
        openState: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        // Prepare required amount of slots
        const customSlots = [];
        for (let i = 0; i < this.customActions; i++) {
            customSlots.push(`action-${i}`);
        }

        return {
            show: this.openState,
            customSlots,
            deleteAttrs: this.setDeleteActionAttrs()
        };
    },
    watch: {
        openState(newVal) {
            this.show = newVal;
        }
    },
    methods: {
        // Determine delete action attributes
        setDeleteActionAttrs() {
            const attr = { ...this.deleteActionAttrs };

            // Delete icon by default
            if (!attr.icon) {
                attr.icon = 'mdi-delete';
            }

            // Use red color unless something else specified
            if (!attr.iconColor && !attr['icon-color']) {
                attr.iconColor = 'red';
            }

            return attr;
        },

        deleteEvent() {
            /**
             * Delete item event.
             */
            this.$emit('delete');
        }
    }
};
</script>
