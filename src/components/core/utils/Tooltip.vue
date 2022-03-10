<template>
  <v-tooltip v-bind="tooltipAttrs">
    <template v-slot:activator="{ on, attrs }">
      <!-- Scoped slot for advanced tooltip content -->
      <slot
        name="default"
        :class="classes"
        v-bind:on="on"
      ></slot>

      <!-- Use icon for tooltip content -->
      <v-btn
        :class="classes"
        v-bind="attrs"
        v-if="icon"
        icon
        v-on="getOnAttrs(on)"
        @click="$emit('clicked')"
      >
        <v-icon v-bind="iconAttrs">{{ icon }}</v-icon>
      </v-btn>

      <!-- Use link for tooltip content -->
      <a
        v-if="link"
        :class="classes"
        v-on="on"
        :href="linkUrl"
        :download="linkDownload"
      >{{ link }}</a>
    </template>
    <span>{{ name }}</span>
  </v-tooltip>
</template>

<script>
export default {
    name: 'DraalTooltip',
    props: {
        /**
         * Tooltip text.
         */
        name: {
            type: String,
            required: true
        },
        /**
         * Tooltip position: bottom. left, top, right
         */
        position: {
            type: String,
            required: false,
            default: 'top'
        },
        /**
         * Style classes for tooltip button or link
         */
        classes: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Name of icon used for tooltip button.
         */
        icon: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Size of tooltip button icon: dense, large, small, x-large, x-small.
         */
        iconSize: {
            type: String,
            required: false,
            default: 'x-large'
        },
        /**
         * Color of tooltip button icon.
         */
        iconColor: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Render tooltip as link. Don't specify any of the icon related props.
         */
        link: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Download the link target as file (instead of navigating to the file).
         */
        linkDownload: {
            type: String,
            required: false,
            default: null
        },
        /**
         * href target of the link.
         */
        linkUrl: {
            type: String,
            required: false,
            default: null
        }
    },
    computed: {
        tooltipAttrs() {
            return this.position ? { [`${this.position}`]: true } : {};
        },

        iconAttrs() {
            const { iconSize, iconColor } = this;

            const attrs = {
                [`${iconSize}`]: true
            };

            if (iconColor) {
                attrs.color = iconColor;
            }

            return attrs;
        }
    },
    methods: {
        getOnAttrs(attrs) {
            const onAttrs = attrs;
            if (this.$listeners.scroll) {
                onAttrs.wheel = data => {
                    data.preventDefault();

                    /**
                     * Wheel event.
                     *
                     * @parameter data Event data.
                     */
                    this.$emit('scroll', data);
                };
            }

            return onAttrs;
        }
    }
};
</script>
