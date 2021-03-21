import DraalMenu from './Menu.vue';

describe('DraalMenu', () => {
    beforeAll(() => {
        prepareVuetify();
        createDataApp();
    });

    function createMenu(menuItems, template) {
        function callback() { }

        return createTestComponent(
            'TestDraalMenu',
            { DraalMenu },
            template,
            ['iconAttrs', 'menuItems', 'cbData'],
            {
                menuItems,
                iconAttrs: {
                    icon: 'mdi-dots-vertical'
                },
                cbData: callback
            },
            {
                stubs: {
                    DraalMenu
                }
            }
        );
    }

    async function openMenuTest(wrapper) {
        // WHEN opening the menu
        const el = wrapper.find('.mdi-dots-vertical');
        el.trigger('click');
        await wrapper.vm.$nextTick();

        // THEN visibility status is correct
        expect(wrapper.emitted().visibility[0][0]).toBeTruthy();
    }

    it('menu is opened and item is clicked', async () => {
        const menuCalled = [0, 0];
        let cbData = null;

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

        const template = `
            <v-app>
                <draal-menu :menuAttrs="{}" :cbData="cbData" :menuItems="menuItems"
                :iconAttrs="iconAttrs" @visibility="status => $emit('visibility', status)">
                </draal-menu>
            </v-app>
        `;

        // GIVEN menu component with action items
        const wrapper = createMenu(menuItems, template);
        await openMenuTest(wrapper);

        // -----

        // WHEN menu item is clicked
        const el = wrapper.findAll('.draal-menu-action-title');
        el.at(0).trigger('click');
        await wrapper.vm.$nextTick();

        // THEN callback is called
        expect(menuCalled[0]).toEqual(1);
        expect(menuCalled[1]).toEqual(0);
        expect(cbData !== null).toBeTruthy();

        // AND menu is in closed state
        expect(wrapper.emitted().visibility[0][1]).toBeFalsy();

        wrapper.destroy();
    });

    it('custom menu content', async () => {
        const template = `
            <v-app>
              <draal-menu :menuAttrs="{}" :cbData="cbData" :menuItems="menuItems"
              :iconAttrs="iconAttrs" @visibility="status => $emit('visibility', status)">
              <template v-slot:menu-content="{ setVisibility }"><v-btn
              class="menu-content-button" @click="setVisibility(false)">Button</v-btn>
              </template></draal-menu>
            </v-app>
        `;

        // GIVEN menu component with custom content
        const wrapper = createMenu([], template);
        await openMenuTest(wrapper);

        // -----

        // WHEN button inside menu content is clicked
        const el = wrapper.findAll('.menu-content-button');
        el.at(0).trigger('click');
        await wrapper.vm.$nextTick();

        // THEN menu is in closed state
        expect(wrapper.emitted().visibility[0][1]).toBeFalsy();

        wrapper.destroy();
    });
});
