/* eslint-disable no-empty-pattern */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify/lib';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
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

global.getDropEvent = (name = 'drop', data = {}) => {
    const dropEvent = new Event(name);
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

global.attachToDocument = (target = document.body) => {
    const elem = document.createElement('div');
    target.appendChild(elem);
    return elem;
};

global.createDataApp = () => {
    const el = document.createElement('div');
    el.setAttribute('data-app', true);
    document.body.appendChild(el);
    return el;
};

global.removeDataApp = el => document.body.removeChild(el);

global.mountedComponentFactory = (component, propsData = {}, params = {}) => {
    const localVue = createLocalVue();
    const options = {
        localVue, vuetify: getVuetify(), propsData, ...params
    };
    return mount(component, options);
};

global.shallowMountedComponentFactory = (component, propsData = {}, params = {}) => {
    const localVue = createLocalVue();
    const options = {
        localVue, vuetify: getVuetify(), propsData, ...params
    };
    return shallowMount(component, options);
};

global.createTestComponent = (name, components, template, props, propsData, options = {}) => {
    const localVue = createLocalVue();

    const App = localVue.component(name, {
        components,
        props,
        template
    });

    return mount(App, {
        localVue,
        vuetify: getVuetify(),
        propsData,
        ...options
    });
};

window.URL.createObjectURL = function createObjectURL() { };
