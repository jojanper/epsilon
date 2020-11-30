<template>
  <div
    @dragenter="setDragging(true)"
    @dragend="setDragging(false)"
    @dragleave="setDragging(false)"
    @dragover.prevent
    @drop="onDrop"
    :class="['dropbox mdi mdi-drag', dragging ? 'dropbox-highlight' : '']"
    :title="title"
  ></div>
</template>

<script>
// Send dragging event, show placeholder as drop file here
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
        }
    },
    data() {
        return {
            dragging: false
        };
    },
    methods: {
        onDrop(e) {
            e.preventDefault();

            /**
             * File drop event.
             */
            this.$emit('fileDrop', e.dataTransfer.files);
            this.dragging = false;

            return false;
        },

        setDragging(status) {
            this.dragging = status;

            /**
             * File dragging event.
             */
            this.$emit('dragging', this.dragging);
        }
    }
};
</script>
