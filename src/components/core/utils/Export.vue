<template>
  <a :href="url" :download="name">
    <slot name="default"></slot>
  </a>
</template>

<script>
/**
 * Export data to local file system.
 *
 * @displayName DraalExport
 */
export default {
    name: 'DraalExport',
    props: {
        /**
         * File name.
         */
        name: {
            type: String,
            required: true
        },
        /**
         * File content.
         */
        url: {
            required: true
        }
    }
};
</script>
