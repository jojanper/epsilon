<template>
  <div id="app">
    <draal-header :routes="header.routes" :appName="header.appName"></draal-header>
    <div class="container">
      <router-view/>
    </div>
    <draal-footer :link="footer.link" :title="footer.name"></draal-footer>
  </div>
</template>

<script>
import DraalHeader from '@/components/Header.vue';
import DraalFooter from '@/components/Footer.vue';

export default {
    name: 'App',
    components: {
        DraalHeader,
        DraalFooter
    },
    data() {
        return {
            header: {
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
            },
            footer: {
                link: 'https://github.com/jojanper/epsilon',
                name: 'Epsilon powered by Vue'
            }
        };
    }
};
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
.container {
    min-height: 400px;
}
</style>
