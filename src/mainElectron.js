import Vue from 'vue';

import { vuetify } from './plugins/vuetify';
import App from './App.vue';
import router from './router/electron';
import store from './store';
import i18n from './i18n';
import './plugins/vee-validate';

Vue.config.productionTip = false;

const AppInstance = new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
    vuetify
}).$mount('#app');

export default AppInstance;
