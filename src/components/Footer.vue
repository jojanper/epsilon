<template>
  <footer class="footer">
    <div class="container-fluid w-100">
      <span class="text-muted">
        <div v-if="appVersion">Version: {{ appVersion }}</div>
      </span>
    </div>
  </footer>
</template>

<script>
import { appComputed } from '@/store/helpers';

export default {
    name: 'DraalFooter',
    computed: {
        ...appComputed
    }
};
</script>

<style lang="scss">
.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px; /* Set the fixed height of the footer here */
    line-height: 60px; /* Vertically center the text there */
    background-color: #f5f5f5;
}
</style>
