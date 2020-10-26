<template>
  <div class="mt-3 pb-3">
    <footer class="footer grey lighten-4">
      <div class="container-fluid w-100">
        <span class="text-muted">
          <div v-if="appVersion">Application version: {{ appVersion }}</div>
        </span>
      </div>
    </footer>
  </div>
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
    height: 60px;
    margin-left: auto;
    margin-right: auto;
    padding: 1.25em 0;
    width: 100%;
    box-shadow: 0 1px 4px 0px rgba(0, 0, 0, 0.8);
}
</style>
