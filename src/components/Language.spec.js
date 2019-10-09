import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import Vuetify from 'vuetify/lib';
import { mount, RouterLinkStub, createLocalVue } from '@vue/test-utils';

import DraalLanguageSelection from './Language.vue';
import { CONFIG } from '../plugins/vuetify';


Vue.use(Vuetify, CONFIG);
Vue.use(VueI18n);
Vue.use(Vuex);

const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: {
            header: {
                selectLanguage: 'Change language',
                languageSelections: [
                    { title: 'English', lang: 'en' },
                    { title: 'Finnish', lang: 'fi' }
                ]
            }
        },
        fi: {
            header: {
                selectLanguage: 'Vaihda kieli',
                languageSelections: [
                    { title: 'Englanti', lang: 'en' },
                    { title: 'Suomi', lang: 'fi' }
                ]
            }
        }
    }
});

describe('DraalLanguageSelection', () => {
    let wrapper;
    let localVue;
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

    beforeEach(() => {
        localVue = createLocalVue();

        const App = localVue.component('TestDraalHeader', {
            components: {
                DraalLanguageSelection
            },
            template: `
              <v-app>
                <draal-language-selection></draal-language-selection>
              </v-app>
            `
        });

        wrapper = mount(App, {
            store,
            localVue,
            stubs: {
                RouterLink: RouterLinkStub,
                DraalLanguageSelection
            },
            i18n,
            attachToDocument: true,
            vuetify: new Vuetify()
        });
    });

    it('user can change language', (done) => {
        // User opens the language selection menu
        const elements = wrapper.findAll('button');
        elements.at(0).trigger('click');

        wrapper.vm.$nextTick(() => {
            // And clicks the second language
            const langEls = wrapper.findAll('.v-list-item');
            langEls.at(1).trigger('click');

            // Language is selected
            expect(selectedLang).toEqual('fi');

            done();
        });
    });
});
