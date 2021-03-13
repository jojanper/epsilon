<template>
  <v-icon
    @dragenter="setDragging(true)"
    @dragend="setDragging(false)"
    @dragleave="setDragging(false)"
    @dragover.prevent
    @drop="onDrop"
    :class="[`dropbox ${cls}`, dragging ? `${dragClass}` : '']"
    v-bind="attrs"
    :title="title"
  >{{ icon }}</v-icon>
</template>

<script>
/**
 * File drop component.
 *
 * @displayName DraalFileDrop
 */
export default {
    name: 'DraalFileDrop',
    props: {
        /**
         * Component title.
         */
        title: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Additional CSS class(es).
         */
        cls: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Icon name.
         */
        icon: {
            type: String,
            required: false,
            default: 'mdi-drag'
        },
        /**
         * Icon size. On dragging event the size is changed to x-large.
         */
        iconSize: {
            type: String,
            required: false,
            default: 'medium'
        },
        /**
         * Icon color.
         */
        iconColor: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Dragging class.
         */
        dragClass: {
            type: String,
            required: false,
            default: 'dropbox-highlight'
        },
        /**
         * Icon size on dragging.
         */
        iconSizeDrag: {
            type: String,
            required: false,
            default: 'x-large'
        }
    },
    data() {
        return {
            dragging: false
        };
    },
    computed: {
        attrs() {
            const iconSize = this.dragging ? this.iconSizeDrag : this.iconSize;
            const attrs = {
                [`${iconSize}`]: true
            };

            if (this.iconColor) {
                attrs.color = this.iconColor;
            }

            return attrs;
        }
    },
    methods: {
        onDrop(e) {
            e.preventDefault();

            /**
             * File drop event.
             *
             * @property {array} files Selected files.
             */
            this.$emit('fileDrop', e.dataTransfer.files);
            this.dragging = false;

            return false;
        },

        setDragging(status) {
            this.dragging = status;

            /**
             * File dragging event.
             *
             * @property {boolean} status Drag status.
             */
            this.$emit('dragging', this.dragging);
        }
    }
};
</script>

<style scoped lang="scss">
.dropbox {
    cursor: pointer;
}
</style>
