/* eslint-disable no-empty-pattern */
import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { cloneDeep } from 'lodash';

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

window.URL.createObjectURL = function createObjectURL() { };
