import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import Vuetify from 'vuetify';
import { mount, shallowMount, RouterLinkStub, createLocalVue } from '@vue/test-utils';

import DraalHeader from './Header.vue';

const { getComputedStyle } = window
window.getComputedStyle = function getComputedStyleStub(el) {
	return {
        ...getComputedStyle(el),
		transitionDelay: '',
		transitionDuration: '',
		animationDelay: '',
        animationDuration: '',
        getPropertyValue() {
            return '';
        }
	}
}

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

/**
 * Adds a warapping `div data-app="true"` to the body so that we don't
 * get Vuetify complaining about missing data-app attribute for some components.
 *
 * @return undefined
 */
/*
function addElemWithDataAppToBody() {
    const app = document.createElement('div');
    app.setAttribute('data-app', true);
    document.body.append(app);
};

addElemWithDataAppToBody();
*/

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
        //localVue = createLocalVue();
        const wrapper = shallowMount(DraalHeader, {
            localVue,
            propsData: props,
            stubs: {
                RouterLink: RouterLinkStub
            }
        });
        const elements = wrapper.findAll('a');
        expect(elements.length).toEqual(2);
        //console.log(wrapper.html());
        expect(elements.at(0).text()).toMatch(props.appName);
        expect(elements.at(1).text()).toMatch(props.routes[0].title);
    });

    it('user can change language', () => {
        //localVue = createLocalVue();
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

        const state = {
            foo: []
        };
        const getters = {};

        const actions = {
            setLang(state, obj) {
                console.log('Set lang HIPPII', obj.lang);
                //console.log(obj);
            }
        };

        const store = new Vuex.Store({
            modules: {
                app: {
                    namespaced: true,
                    state,
                    actions,
                    getters
                }
            }
        });

        const wrapper = mount(App/*DraalHeader*/, {
            store,
            localVue,
            propsData: props,
            stubs: {
                RouterLink: RouterLinkStub,
                DraalHeader
            },
            /*
            mocks: {
                $store: {
                    modules: {
                        app: {
                            state: {},
                            getters: {},
                            actions: {
                                setLang() {
                                    console.log('Set lang');
                                }
                            }
                        }
                    }
                }
            },
            */
            i18n,
            attachToDocument: true,
            //sync: false
        });
        const elements = wrapper.findAll('button');
        //console.log(elements.length);
        //console.log(elements.at(1).html());
        console.log(wrapper.html());

        elements.at(1).trigger('click');
        //setTimeout(() => {

            //wrapper.vm.$nextTick(() => {

            //console.log(document.body.innerHTML);
                //console.log(wrapper.html());
                //console.log(wrapper.vm.$store);

                const langEls = wrapper.findAll('a.v-list__tile');
                //console.log(langEls.at(0).html());
                //console.log(langEls.at(1).html());

                //console.log(langEls.at(0));

                //console.log(wrapper.vm);
                langEls.at(1).trigger('click');

            //console.log(document.body.innerHTML);
            //expect(elements.length).toEqual(2);
            //expect(elements.at(0).text()).toMatch(props.appName);
            //expect(elements.at(1).text()).toMatch(props.routes[0].title);

            //const el = document.getElementsByClassName('v-list__tile')
            //console.log(el.length);

            //el[0].dispatchEvent(new Event('click'));

                //done();
            //});
        //}, 1000);
    });
});
