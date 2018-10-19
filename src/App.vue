<template>
  <div id="app">
    <draal-header :routes="header.routes" :appName="header.appName"></draal-header>
    <draal-notification></draal-notification>
    <div class="container">

      <i class="icon ion-md-create text-success ml-2"></i><span>&nbsp;Sign up</span>
      <i class="icon ion-md-log-in text-primary ml-2"></i><span>&nbsp;Login</span>
      <i class="icon ion-md-log-out text-primary ml-2"></i><span>&nbsp;Logout</span>

      <router-view/>
      <button v-on:click="addAlert('Success')">Add success alert</button>
      <button v-on:click="addAlert('Info')">Add info alert</button>
      <button v-on:click="addAlert('Warning')">Add warning alert</button>
      <button v-on:click="addAlert('Error')">Add error alert</button>
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
import DraalNotification from '@/components/Notification.vue';
import IEXApi from '@/common/iex_api';
import { NotificationMessage } from '@/common/handlers';
import { notificationActions } from '@/store/helpers';

function dummyErrorHandler() {}

export default {
    name: 'App',
    components: {
        DraalHeader,
        DraalFooter,
        DraalNotification
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
    },

    methods: {
        ...notificationActions,
        addAlert(mode) {
            this.addNotification(NotificationMessage[`create${mode}`](`${mode} notification`));
        }
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
