<template>
  <v-app id="app">
    <draal-go-2-top></draal-go-2-top>
    <draal-header :routes="header.routes" :appName="header.appName"></draal-header>
    <draal-notification></draal-notification>
    <div class="container">
      <i class="icon ion-md-create text-success ml-2"></i>
      <span>&nbsp;Sign up</span>
      <i class="icon ion-md-log-in text-primary ml-2"></i>
      <span>&nbsp;Login</span>
      <i class="icon ion-md-log-out text-primary ml-2"></i>
      <span>&nbsp;Logout</span>

      <router-view/>
      <v-flex xs12 sm34 text-xs-center>
        <v-btn color="primary" v-on:click="addAlert('Success')">Add success alert</v-btn>
        <v-btn color="info" v-on:click="addAlert('Info')">Add info alert</v-btn>
        <v-btn color="warning" v-on:click="addAlert('Warning')">Add warning alert</v-btn>
        <v-btn color="error" v-on:click="addAlert('Error')">Add error alert</v-btn>
      </v-flex>
      <ul class="list-group">
        <li
          v-for="(item, index) in data"
          :key="index"
          class="list-group-item"
        >{{ item.headline }} - {{ item.summary }}</li>
      </ul>
    </div>
    <draal-footer :link="footer.link" :title="footer.name"></draal-footer>
  </v-app>
</template>

<script>
import DraalHeader from '@/components/Header.vue';
import DraalFooter from '@/components/Footer.vue';
import DraalNotification from '@/components/Notification.vue';
import DraalGo2Top from '@/components/utils/Gotop.vue';
import IEXApi from '@/common/iex_api';
import { NotificationMessage } from '@/common/models';
import { notificationActions } from '@/store/helpers';

function dummyErrorHandler() {}

export default {
    name: 'App',
    components: {
        DraalHeader,
        DraalFooter,
        DraalNotification,
        DraalGo2Top
    },

    created() {
        IEXApi.stock('aapl').subscribe(
            data => data.news.forEach(news => this.data.push(news)),
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
            const timeout = Math.floor(Math.random() * 5000);
            const msg = `${mode} notification. Timeout ${timeout}msec`;
            this.addNotification(
                NotificationMessage[`create${mode}`](msg, { timeout })
            );
        }
    }
};
</script>

<style lang="scss" scoped>
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import "~nprogress/nprogress.css";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
.container {
  min-height: 400px;
}
</style>
