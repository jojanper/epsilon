<template>
  <div
    @dragenter="dragging=true"
    @dragend="dragging=false"
    @dragleave="dragging=false"
    @dragover.prevent
    @drop="onDrop"
    :class="['dropbox mdi mdi-drag', dragging ? 'dropbox-highlight' : '']"
    :title="title"
  ></div>
</template>

<script>
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
        }
    }
};
</script>
