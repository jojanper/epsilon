import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import DraalFooter from './Footer.vue';
import { getters } from '@/store/modules/app';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('DraalFooter', () => {
    const state = {
        appVersion: {
            localRef: null,
            reload: false
        }
    };

    function validateRender(expected) {
        const store = new Vuex.Store({
            modules: {
                app: {
                    namespaced: true,
                    state,
                    getters
                }
            }
        });

        const wrapper = shallowMount(DraalFooter, {
            store, localVue
        });

        const elements = wrapper.findAll('.text-muted');
        expect(elements.at(0).text()).toEqual(expected);
    }

    it('application version not visible', () => {
        validateRender('');
    });

    it('application version visible', () => {
        state.appVersion.localRef = '1.2.3';
        validateRender('Application version: 1.2.3');
    });
});
