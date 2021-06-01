import DraalTooltipMenu from './TooltipMenu.vue';

describe('DraalTooltipMenu', () => {
    let elAttach;

    beforeAll(() => {
        prepareVuetify();
        elAttach = createDataApp();
    });

    afterAll(() => {
        removeDataApp(elAttach);
    });

    function getTestComponent(template, propsData = {}) {
        return createTestComponent(
            'TestDraalTooltipMenu',
            { DraalTooltipMenu },
            template,
            ['menuItems', 'menuAttrs', 'data'],
            propsData,
            {
                attachTo: createDataApp('test-tooltipmenu', false),
                stubs: {
                    DraalTooltipMenu
                }
            }
        );
    }

    it('action menu', async () => {
        let clickData;

        const menuPresets = [
            {
                title: 'Preset 1',
                fn: data => {
                    clickData = data;
                }
            }
        ];

        // GIVEN tooltip menu component with custom menu entry slot
        const template = `<draal-tooltip-menu
            tooltip-text="Tooltip text"
            :menu-items="menuItems"
            :cb-data="data"
            :menu-attrs="{ left: true, 'offset-y': true }">
                <template v-slot:menu-entry="{ menu, tooltip }">
                    <v-icon v-bind="menuAttrs" v-on="{ ...menu, ...tooltip}">mdi-menu</v-icon>
                </template>
            </draal-tooltip-menu>`;
        const wrapper = getTestComponent(template, {
            menuItems: menuPresets,
            menuAttrs: {},
            data: {
                foo: 'bar'
            }
        });

        // WHEN opening the menu and clicking the first item
        wrapper.find('.mdi-menu').trigger('click');
        await wrapper.vm.$nextTick();
        wrapper.findAll('.draal-menu-action-title').at(0).trigger('click');
        await wrapper.vm.$nextTick();

        // THEN menu action is called with correct parameter
        expect(clickData).toEqual({ foo: 'bar' });

        wrapper.destroy();
    });

    it('custom menu', async () => {
        // GIVEN tooltip menu component with custom menu entry and content slot
        const template = `<draal-tooltip-menu
            tooltip-text="Tooltip text"
            :menu-attrs="{ left: true, position: 'top' }">
                <template v-slot:menu-entry="{ menu, tooltip }">
                    <v-icon v-bind="menuAttrs" v-on="{ ...menu, ...tooltip}">mdi-menu</v-icon>
                </template>
                <template v-slot:menu-content="{ setVisibility }">
                    <v-btn slot="append-outer"
                        @click="setVisibility(false)">Button</v-btn>
                </template>
            </draal-tooltip-menu>`;
        const wrapper = getTestComponent(template, {
            menuAttrs: {}
        });

        // WHEN opening the menu
        wrapper.find('.mdi-menu').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN custom menu content is visible
        expect(wrapper.findAll('.menuable__content__active').length).toEqual(1);

        // -----

        // WHEN closing the menu content
        wrapper.findAll('button').at(0).trigger('click');
        await wrapper.vm.$nextTick();

        // THEN custom menu content is no longer visible
        expect(wrapper.findAll('.menuable__content__active').length).toEqual(0);

        wrapper.destroy();
    });
});
