<template>
  <v-app id="app">
    <draal-go-2-top />
    <draal-header
      :homeRoute="home"
      :routes="header.routes"
      :appName="header.appName"
    ></draal-header>
    <draal-breadcrumbs
      :home-route-name="home"
      :home-name="homeName"
      class="mt-3 mr-3 ml-3"
    ></draal-breadcrumbs>
    <draal-notification />
    <div class="app-container mr-3 ml-3">
      <draal-content-view>
        <router-view />
      </draal-content-view>
    </div>
    <draal-footer />
  </v-app>
</template>

<script>
import DraalHeader from '@/components/app/Header.vue';
import DraalFooter from '@/components/app/Footer.vue';
import DraalNotification from '@/components/app/Notification.vue';
import DraalBreadcrumbs from '@/components/app/Breadcrumbs.vue';
import DraalContentView from '@/components/app/Content.vue';
import DraalGo2Top from '@/components/core/utils/Gotop.vue';
import AppRefresh from '@/common/utils/refresh';
import { isElectron } from '@/common/utils';
import { CONFIG } from '@/router/navigation';
import { appActions } from '@/store/helpers';

export default {
    name: 'App',
    components: {
        DraalHeader,
        DraalFooter,
        DraalNotification,
        DraalGo2Top,
        DraalBreadcrumbs,
        DraalContentView
    },
    created() {
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
        ...appActions
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
.app-container {
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

.v-messages {
    padding-bottom: 15px !important;
}

.file-query-input-wrapper {
    .file-query-input {
        top: -15px;
        position: relative;

        .no-outlined {
            margin-bottom: -15px;
            padding-bottom: 5px;
        }

        .spinner-wrapper {
            position: relative;
            margin-bottom: 15px;

            .no-outlined {
                top: 10px;
                position: relative;
                padding-bottom: 15px;
            }
        }

        .second-row {
            position: relative;
            padding-top: 0px;
            margin-bottom: 0px;

            .no-outlined {
                padding-top: 5px;
            }

            .v-text-field__details {
                margin-bottom: 0px;
            }

            .v-messages {
                padding-bottom: 0px !important;
            }
        }
    }
}

.router-link-exact-active,
.router-link-active {
    font-weight: bold;
}
.file-input input {
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
    color: red !important;
    font-size: 48px !important;
    padding-bottom: 10px;
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

.cursor-pointer {
    cursor: pointer;
}

.text-underline {
    text-decoration: underline;
}

.utils-terminal-upload {
    color: red !important;
}
</style>
