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
import Network from '@/common/network';

export default {
    name: 'App',
    components: {
        DraalHeader,
        DraalFooter
    },
    created() {
        // console.log('created');
        Network.get('https://api.iextrading.com/1.0/stock/aapl/batch?types=quote,news,chart&range=1m&last=1')
            .then((response) => {
                // console.log(response);
                response.data.chart.forEach(chart => this.data.push(chart));
            });
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
.container {
    min-height: 400px;
}
</style>
