/* eslint-disable no-empty-pattern */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify/lib';
import { createLocalVue } from '@vue/test-utils';
import { cloneDeep } from 'lodash';

import { CONFIG } from '@/plugins/vuetify';
import { getters } from '@/store/modules/notification';


global.createModuleStore = vuexModule => {
    createLocalVue().use(Vuex);

    const store = new Vuex.Store(cloneDeep(vuexModule));
    if (vuexModule.actions.init) {
        store.dispatch('init');
    }

    return store;
};

global.createLocalNotificationStore = () => {
    const state = {
        notifications: []
    };

    const actions = {
        addNotification({ }, msg) {
            state.notifications.push(msg);
        },

        removeNotification() {
            state.notifications = [];
        }
    };

    const store = new Vuex.Store({
        modules: {
            notification: {
                namespaced: true,
                state,
                actions,
                getters
            }
        }
    });

    return { store, state };
};

global.getDropEvent = (data = {}) => {
    const dropEvent = new Event('drop');
    Object.assign(dropEvent, {
        dataTransfer: {
            ...data
        }
    });

    return dropEvent;
};

global.prepareVuetify = () => {
    Vue.use(Vuetify, CONFIG);
};

global.getVuetify = () => new Vuetify();

window.URL.createObjectURL = function createObjectURL() { };
