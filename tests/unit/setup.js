/* eslint-disable no-empty-pattern */
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify/lib';
import flushPromises from 'flush-promises';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { cloneDeep } from 'lodash';

import { CONFIG } from '@/plugins/vuetify';

/**
 * Create store with namespaced modules.
 *
 * @param {*} storeModules Namespaced store modules.
 */
global.createTestStore = storeModules => {
    const store = new Vuex.Store({
        modules: cloneDeep(storeModules)
    });

    // Execute init action for every module automatically
    Object.keys(storeModules).forEach(moduleName => {
        if (storeModules[moduleName].actions && storeModules[moduleName].actions.init) {
            store.dispatch(`${moduleName}/init`);
        }
    });

    return store;
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

global.prepareVuex = () => {
    Vue.use(Vuex);
};

global.attachToDocument = (target = document.body) => {
    const elem = document.createElement('div');
    target.appendChild(elem);
    return elem;
};

global.createDataApp = (cls = '', attach = true) => {
    const el = document.createElement('div');
    el.setAttribute('data-app', true);

    if (cls) {
        el.setAttribute('class', cls);
    }

    if (attach) {
        document.body.appendChild(el);
    }

    return el;
};

global.removeDataApp = el => document.body.removeChild(el);

global.mountedComponentFactory = (component, propsData = {}, componentParams = {}) => {
    const params = componentParams;
    if (!params.localVue) {
        params.localVue = createLocalVue();
    }

    const options = {
        vuetify: getVuetify(), propsData, ...params
    };
    return mount(component, options);
};

global.shallowMountedComponentFactory = (component, propsData = {}, componentParams = {}) => {
    const params = componentParams;
    if (!params.localVue) {
        params.localVue = createLocalVue();
    }

    const options = {
        vuetify: getVuetify(), propsData, ...params
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

global.flushTest = async () => flushPromises();

global.flushTestAll = async (allTimers = false) => {
    // Get rid of any pending validations on the leading edge
    await flushPromises();

    // Any delayed or debounced state computations
    if (allTimers) {
        jest.runAllTimers();
    } else {
        jest.runOnlyPendingTimers();
    }

    // Get rid of the pending rendering tick
    await flushPromises();
};

window.URL.createObjectURL = function createObjectURL() { };
