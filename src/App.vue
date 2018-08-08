<template>
  <div id="app">
    <draal-header :routes="routes" :appName="appName"></draal-header>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import DraalHeader from '@/components/Header.vue';

export default {
    name: 'App',
    components: {
        DraalHeader
    },
    data() {
        return {
            appName: 'Epsilon',
            routes: [
                {
                    name: 'home',
                    title: 'Home'
                },
                {
                    name: 'about',
                    title: 'About'
                }
            ]
        };
    }
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>
