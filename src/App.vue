<template>
  <v-app id="app">
    <draal-go-2-top></draal-go-2-top>
    <draal-header :homeRoute="home" :routes="header.routes" :appName="header.appName"></draal-header>
    <draal-notification></draal-notification>
    <div class="container">
      <router-view />
      <v-flex xs12 sm34 text-xs-center>
        <v-btn class="mr-2" color="primary" v-on:click="addAlert('Success')">Add success alert</v-btn>
        <v-btn class="mr-2" color="info" v-on:click="addAlert('Info')">Add info alert</v-btn>
        <v-btn class="mr-2" color="warning" v-on:click="addAlert('Warning')">Add warning alert</v-btn>
        <v-btn color="error" v-on:click="addAlert('Error')">Add error alert</v-btn>
      </v-flex>

      <div v-if="data.length">
        <div class="row text-left pt-3">
          <div class="col-sm">{{ quote.companyName }} ({{ quote.symbol }})</div>
          <div class="col-sm">Close: {{ chart[chart.length - 1].close }}</div>
          <div class="col-sm">High: {{ chart[chart.length - 1].high }}</div>
          <div class="col-sm">Low: {{ chart[chart.length - 1].low }}</div>
        </div>

        <div class="pb-3">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </div>

        <v-data-table
          class="mt-3 pt-3 elevation-1"
          :headers="headers"
          :items="data"
          item-key="url"
          :search="search"
          show-expand
        >
          <template v-slot:item.datetime="{ item }">
            <div v-html="getTime(item.datetime)"></div>
          </template>
          <template v-slot:item.headline="{ item }">
            <a :href="item.url" target="_blank">{{ item.headline }}</a>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="1">
              <img class="p-3" :src="item.image" width="150" height="150" />
            </td>
            <td class="text-left" :colspan="headers.length - 1">{{ item.summary }}</td>
          </template>
        </v-data-table>
      </div>
    </div>
    <draal-footer></draal-footer>
  </v-app>
</template>

<script>
import DraalHeader from '@/components/Header.vue';
import DraalFooter from '@/components/Footer.vue';
import DraalNotification from '@/components/Notification.vue';
import DraalGo2Top from '@/components/utils/Gotop.vue';
import { IEXApi } from '@/common/api';
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
        IEXApi.stock('aapl').subscribe(data => {
            this.quote = Object.assign({}, data.quote);
            data.chart.forEach(chart => this.chart.push(chart));
            data.news.forEach(news => this.data.push(news));
        }, dummyErrorHandler);

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

            data: [],
            chart: [],
            quote: {},

            search: '',
            headers: [
                {
                    text: 'Source',
                    align: 'left',
                    filterable: true,
                    sortable: true,
                    value: 'source'
                },
                {
                    text: 'Summary',
                    align: 'left',
                    filterable: true,
                    sortable: true,
                    value: 'headline'
                },
                {
                    text: 'Date',
                    align: 'left',
                    filterable: true,
                    sortable: true,
                    value: 'datetime'
                },
                {
                    text: 'More...',
                    value: 'data-table-expand'
                }
            ]
        };
    },

    methods: {
        ...notificationActions,
        ...appActions,
        addAlert(mode) {
            const timeout = Math.floor(Math.random() * 5000);
            const msg = `${mode} notification. Timeout ${timeout}msec`;
            this.addNotification(NotificationMessage[`create${mode}`](msg, { timeout }));
        },
        getTime(ts) {
            return new Date(ts).toDateString();
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
.v-data-table tbody tr.v-data-table__expanded__content {
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
}
.router-link-exact-active,
.router-link-active {
    font-weight: bold;
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
