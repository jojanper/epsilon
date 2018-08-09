<template>
  <div id="app">
    <draal-header :routes="routes" :appName="appName"></draal-header>
    <div class="container">
      <router-view/>
    </div>
    <footer class="footer">
      <div class="container">
        <span class="text-muted">
            <a href="https://github.com/jojanper/epsilon" target="_blank">Epsilon powered by Vue</a>
        </span>
      </div>
    </footer>
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
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px; /* Set the fixed height of the footer here */
  line-height: 60px; /* Vertically center the text there */
  background-color: #f5f5f5;
}
</style>
