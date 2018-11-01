import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import Vuetify from 'vuetify';
import { mount, shallowMount, RouterLinkStub, createLocalVue } from '@vue/test-utils';

import DraalHeader from './Header.vue';

Vue.use(Vuetify);
Vue.use(VueI18n);
Vue.use(Vuex);

const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: {},
        fi: {}
    }
});

describe('DraalHeader', () => {
    let localVue;

    const props = {
        appName: 'test',
        routes: [
            {
                name: 'home',
                title: 'Testing'
            }
        ]
    };

    beforeEach(() => {
        localVue = createLocalVue();
    });

    it('renders correctly', () => {
        const wrapper = shallowMount(DraalHeader, {
            localVue,
            propsData: props,
            stubs: {
                RouterLink: RouterLinkStub
            }
        });
        const elements = wrapper.findAll('a');
        expect(elements.length).toEqual(2);
        expect(elements.at(0).text()).toMatch(props.appName);
        expect(elements.at(1).text()).toMatch(props.routes[0].title);
    });

    it('user can change language', () => {
        const App = localVue.component('TestDraalHeader', {
            components: {
                DraalHeader
            },
            data() {
                return Object.assign({}, props);
            },
            template: `
              <v-app>
                <draal-header :routes="routes" :appName="appName"></draal-header>
              </v-app>
            `
        });

        let selectedLang = null;

        const store = new Vuex.Store({
            modules: {
                app: {
                    namespaced: true,
                    state: {},
                    actions: {
                        setLang(_state, obj) {
                            selectedLang = obj.lang;
                        }
                    },
                    getters: {}
                }
            }
        });

        const wrapper = mount(App, {
            store,
            localVue,
            propsData: props,
            stubs: {
                RouterLink: RouterLinkStub,
                DraalHeader
            },
            i18n,
            attachToDocument: true
        });

        // User open the language selection menu
        const elements = wrapper.findAll('button');
        elements.at(1).trigger('click');

        // And clicks the second language
        const langEls = wrapper.findAll('a.v-list__tile');
        langEls.at(1).trigger('click');

        // Language is selected
        expect(selectedLang).toEqual('fi');
    });
});
