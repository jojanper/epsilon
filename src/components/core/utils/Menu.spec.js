import { mount, createLocalVue } from '@vue/test-utils';

import DraalMenu from './Menu.vue';

describe('DraalMenu', () => {
    beforeAll(() => {
        prepareVuetify();

        const el = document.createElement('div');
        el.setAttribute('data-app', true);
        document.body.appendChild(el);
    });

    it('menu is opened and item is clicked', async done => {
        const menuCalled = [0, 0];
        let cbData = null;
        let emitted = false;

        const menuItems = [
            {
                title: 'Title 1',
                fn: data => {
                    cbData = data;
                    menuCalled[0] += 1;
                }
            },
            {
                title: 'Title 2',
                fn: () => {
                    menuCalled[1] += 1;
                }
            }
        ];

        const localVue = createLocalVue();

        const App = localVue.component('TestDraalMenu', {
            components: {
                DraalMenu
            },
            props: ['iconAttrs', 'menuItems', 'cbData', 'setVisibility'],
            template: `
              <v-app>
                <draal-menu :menuAttrs="{}" :cbData="cbData" :menuItems="menuItems" :iconAttrs="iconAttrs" @visibility="setVisibility"></draal-menu>
              </v-app>
            `
        });

        function callback() { }

        // GIVEN menu component
        const wrapper = mount(App, {
            localVue,
            vuetify: getVuetify(),
            propsData: {
                menuItems,
                iconAttrs: {
                    icon: 'mdi-dots-vertical'
                },
                cbData: callback,
                setVisibility: status => {
                    emitted = status;
                }
            },
            stubs: {
                DraalMenu
            },
            attachTo: attachToDocument()
        });

        // WHEN clicking the icon
        let el = wrapper.find('.mdi-dots-vertical');
        el.trigger('click');

        await wrapper.vm.$nextTick();

        // THEN callback is called
        el = wrapper.findAll('.draal-menu-action-title');
        el.at(0).trigger('click');
        expect(menuCalled[0]).toEqual(1);
        expect(menuCalled[1]).toEqual(0);
        expect(cbData !== null).toBeTruthy();

        // AND visibility event is received
        expect(emitted).toBeFalsy();

        wrapper.destroy();

        done();
    });
});
