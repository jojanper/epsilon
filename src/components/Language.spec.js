import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import Vuetify from 'vuetify';
import { mount, RouterLinkStub, createLocalVue } from '@vue/test-utils';

import DraalLanguageSelection from './Language.vue';

Vue.use(Vuetify);
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
    });

    it('user can change language', () => {
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

        const wrapper = mount(App, {
            store,
            localVue,
            stubs: {
                RouterLink: RouterLinkStub,
                DraalLanguageSelection
            },
            i18n,
            attachToDocument: true
        });

        // User open the language selection menu
        const elements = wrapper.findAll('button');
        elements.at(0).trigger('click');

        // And clicks the second language
        const langEls = wrapper.findAll('a.v-list__tile');
        langEls.at(1).trigger('click');

        // Language is selected
        expect(selectedLang).toEqual('fi');
    });
});
