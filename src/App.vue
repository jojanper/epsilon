<template>
  <v-app id="app">
    <draal-go-2-top></draal-go-2-top>
    <draal-header :homeRoute="home" :routes="header.routes" :appName="header.appName"></draal-header>
    <draal-breadcrumbs :home-route-name="home" :home-name="homeName" class="mt-3 mr-3 ml-3"></draal-breadcrumbs>
    <draal-notification></draal-notification>
    <div class="container-fluid app-container">
      <router-view />
      <v-flex xs12 sm34 text-xs-center>
        <v-btn class="mr-2" color="primary" v-on:click="addAlert('Success')">Add success alert</v-btn>
        <v-btn class="mr-2" color="info" v-on:click="addAlert('Info')">Add info alert</v-btn>
        <v-btn class="mr-2" color="warning" v-on:click="addAlert('Warning')">Add warning alert</v-btn>
        <v-btn color="error" v-on:click="addAlert('Error')">Add error alert</v-btn>
      </v-flex>

      <div v-if="data.length">
        <div class="row text-left">
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

        <draal-data-table
          :data="data"
          :headers="headers"
          :customColumns="['datetime','headline']"
          expand="More..."
          :tableAttributes="{'item-key': 'url'}"
          :actions="['edit', 'delete']"
          :actionsConfig="{name: 'Actions', width: '15%'}"
        >
          <template v-slot:table.datetime="{ data }">
            <div v-html="getTime(data.datetime)"></div>
          </template>
          <template v-slot:table.headline="{ data }">
            <a :href="data.url" target="_blank">{{ data.headline }}</a>
          </template>
          <template v-slot:table.expand="{ data }">
            <div class="row">
              <div class="hidden-sm-and-down">
                <img class="p-3" :src="data.image" width="150" height="150" />
              </div>
              <div class="col text-left">{{ data.summary }}</div>
            </div>
          </template>
        </draal-data-table>
      </div>
    </div>
    <draal-footer></draal-footer>
  </v-app>
</template>

<script>
import DraalHeader from '@/components/app/Header.vue';
import DraalFooter from '@/components/app/Footer.vue';
import DraalNotification from '@/components/app/Notification.vue';
import DraalBreadcrumbs from '@/components/app/Breadcrumbs.vue';
import DraalGo2Top from '@/components/core/utils/Gotop.vue';
import { IEXApi } from '@/common/api';
import { NotificationMessage } from '@/common/models';
import AppRefresh from '@/common/utils/refresh';
import { isElectron } from '@/common/utils';
import { CONFIG } from '@/router/navigation';
import { appActions, notificationActions } from '@/store/helpers';
import DraalDataTable from '@/components/core/DataTable.vue';

function dummyErrorHandler() {}

export default {
    name: 'App',
    components: {
        DraalHeader,
        DraalFooter,
        DraalNotification,
        DraalGo2Top,
        DraalBreadcrumbs,
        DraalDataTable
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
            homeName: CONFIG.homeName,
            header: {
                appName: 'Epsilon',
                routes: CONFIG.routes.slice(1)
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
                    value: 'source',
                    width: '20%'
                },
                {
                    text: 'Summary',
                    align: 'left',
                    filterable: true,
                    sortable: true,
                    value: 'headline',
                    width: '50%'
                },
                {
                    text: 'Date',
                    align: 'left',
                    filterable: true,
                    sortable: true,
                    value: 'datetime',
                    width: '15%'
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
    //min-height: 400px;
    padding-bottom: 60px;
}
</style>

<style lang="scss">
// No animations for Vuetify
.v-label.theme--light.error--text {
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
    font-size: 48px;
}

.nav-item {
    position: relative;
    top: 1px;
    padding-left: 0;

    a {
        color: #101010 !important;
    }
}
.active {
    font-weight: normal !important;
}
.navbar-brand {
    color: #0065ed !important;
}
</style>
