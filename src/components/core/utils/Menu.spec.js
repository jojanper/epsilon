import { mount, createLocalVue } from '@vue/test-utils';

import DraalMenu from './Menu.vue';

describe('DraalMenu', () => {
    beforeAll(() => {
        prepareVuetify();
    });

    it('menu is opened and item is clicked', done => {
        const menuCalled = [0, 0];

        const menuItems = [
            {
                title: 'Title 1',
                fn: () => {
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
            props: ['iconAttrs', 'menuItems'],
            template: `
              <v-app>
                <draal-menu :menuAttrs="{}" :menuItems="menuItems" :iconAttrs="iconAttrs"></draal-menu>
              </v-app>
            `
        });

        // GIVEN menu component
        const wrapper = mount(App, {
            localVue,
            vuetify: getVuetify(),
            propsData: {
                menuItems,
                iconAttrs: {
                    icon: 'mdi-dots-vertical'
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

        // THEN callback is called
        el = wrapper.findAll('.draal-menu-action-title');
        el.at(0).trigger('click');
        expect(menuCalled[0]).toEqual(1);
        expect(menuCalled[1]).toEqual(0);

        wrapper.destroy();

        done();
    });
});
