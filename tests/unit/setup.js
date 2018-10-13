import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { cloneDeep } from 'lodash';


global.createModuleStore = (vuexModule) => {
    createLocalVue().use(Vuex);

    const store = new Vuex.Store(cloneDeep(vuexModule));
    if (vuexModule.actions.init) {
        store.dispatch('init');
    }

    return store;
};
