<template>
  <div id="app">
    <draal-header :routes="header.routes" :appName="header.appName"></draal-header>
    <div class="container">
      <router-view/>
      <ul class="list-group">
        <li v-for="(item, index) in data" :key="index" class="list-group-item">
            {{ item.date }} - {{ item.close }}
        </li>
        </ul>
    </div>
    <draal-footer :link="footer.link" :title="footer.name"></draal-footer>
  </div>
</template>

<script>
import DraalHeader from '@/components/Header.vue';
import DraalFooter from '@/components/Footer.vue';
import IEXApi from '@/common/iex_api';

function dummyErrorHandler() {}

export default {
    name: 'App',
    components: {
        DraalHeader,
        DraalFooter
    },

    created() {
        IEXApi.stock('aapl').subscribe(
            data => data.chart.forEach(chart => this.data.push(chart)),
            dummyErrorHandler
        );
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
            },
            data: []
        };
    }
};
</script>

<style lang="scss" scoped>
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
.container {
    min-height: 400px;
}
</style>
