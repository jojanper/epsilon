import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { RouterLinkStub, createLocalVue } from '@vue/test-utils';

import DraalLanguageSelection from '../Language.vue';
import { storeModule, name } from '@/store/modules/app';

Vue.use(VueI18n);

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
    let store;

    beforeEach(() => {
        prepareVuetify();
        prepareVuex();

        const localVue = createLocalVue();

        store = createTestStore(storeModule);

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

        wrapper = mountedComponentFactory(App, {}, {
            store,
            localVue,
            stubs: {
                RouterLink: RouterLinkStub,
                DraalLanguageSelection
            },
            i18n,
            attachTo: attachToDocument()
        });
    });

    it('user can change language', done => {
        // User opens the language selection menu
        const elements = wrapper.findAll('button');
        elements.at(0).trigger('click');

        wrapper.vm.$nextTick(() => {
            // And clicks the second language
            const langEls = wrapper.findAll('.v-list-item');
            langEls.at(1).trigger('click');

            // Language is selected
            expect(store.getters[`${name}/appLang`]).toEqual('fi');

            done();
        });
    });
});
