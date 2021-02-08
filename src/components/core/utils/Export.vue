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
        name: {
            type: String,
            required: true
        },
        url: {
            required: true
        }
    }
};
</script>
