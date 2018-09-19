import Vue from 'vue';
import Vuex from 'vuex';

import modules from './modules';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules,
    strict: process.env.NODE_ENV !== 'production'
});

// Execute init action for every module automatically
Object.keys(modules).forEach((moduleName) => {
    if (modules[moduleName].actions && modules[moduleName].actions.init) {
        store.dispatch(`${moduleName}/init`);
    }
});

export default store;
