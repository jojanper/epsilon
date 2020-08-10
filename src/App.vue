<template>
  <v-app id="app">
    <draal-go-2-top></draal-go-2-top>
    <draal-header :homeRoute="home" :routes="header.routes" :appName="header.appName"></draal-header>
    <draal-notification></draal-notification>
    <div class="container">
      <router-view />
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
    <draal-footer></draal-footer>
  </v-app>
</template>

<script>
import DraalHeader from '@/components/Header.vue';
import DraalFooter from '@/components/Footer.vue';
import DraalNotification from '@/components/Notification.vue';
import DraalGo2Top from '@/components/utils/Gotop.vue';
import IEXApi from '@/common/iex_api';
import { NotificationMessage } from '@/common/models';
import AppRefresh from '@/common/utils/refresh';
import { isElectron } from '@/common/utils';
import { CONFIG } from '@/router/navigation';
import { appActions, notificationActions } from '@/store/helpers';

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
        IEXApi.stock('aapl').subscribe(data => data.news.forEach(news => this.data.push(news)), dummyErrorHandler);

        // Get and check initial version
        this.checkVersion();

        // Initialize application new version detection
        if (!isElectron()) {
            // Start version check timer
            AppRefresh.init({ callback: this.checkVersion.bind(this) }).runCheck();
        }
    },

    data() {
        return {
            home: CONFIG.home,
            header: {
                appName: 'Epsilon',
                routes: CONFIG.routes
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
        ...appActions,
        addAlert(mode) {
            const timeout = Math.floor(Math.random() * 5000);
            const msg = `${mode} notification. Timeout ${timeout}msec`;
            this.addNotification(NotificationMessage[`create${mode}`](msg, { timeout }));
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
}
.container {
    min-height: 400px;
    padding-bottom: 60px;
}
</style>

<style lang="scss">
// No animations for Vuetify
label.v-label.theme--light.error--text {
    animation: none !important;
}
.remote-input input {
    cursor: pointer;
}
.noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
.dropbox {
    font-size: 32px;
}
.dropbox-highlight {
    color: red;
}
</style>
