import DraalExpandItem from './ExpandItem.vue';

describe('DraalExpandItem', () => {
    beforeAll(() => {
        prepareVuetify();
        createDataApp();
    });

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalExpandItem, {
            title: 'Expand',
            ...propsData
        });
    }

    it('title is present', () => {
        const wrapper = factory();
        const el = wrapper.find('.expand-title');
        expect(el.text()).toEqual('Expand');
        wrapper.destroy();
    });

    it('item is closed', async () => {
        // GIVEN item is in opened state
        const wrapper = factory({
            value: true
        });
        expect(wrapper.find('.mdi-menu-up')).toBeDefined();

        // WHEN closing the item programmatically
        await wrapper.setProps({ value: false });
        await wrapper.vm.$nextTick();

        // THEN item is in closed state
        expect(wrapper.find('.mdi-menu-down')).toBeDefined();

        wrapper.destroy();
    });

    it('item is opened and closed', async () => {
        // GIVEN expand item
        const wrapper = factory();

        // WHEN opening item
        wrapper.find('.mdi-menu-down').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN state is opened
        expect(wrapper.emitted().input[0][0]).toBeTruthy();

        // -----

        // WHEN closing item
        wrapper.find('.mdi-menu-up').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN stete is closed
        expect(wrapper.emitted().input[0][1]).toBeFalsy();

        wrapper.destroy();
    });

    it('item is deleted', async () => {
        // GIVEN delete icon is available in expand item
        const wrapper = factory({
            deleteActionAttrs: {
                name: 'Delete'
            }
        });

        // WHEN clicking delete icon
        expect(Object.prototype.hasOwnProperty.call(wrapper.emitted(), 'delete')).toBeFalsy();
        wrapper.find('.mdi-delete').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN delete event is emitted
        expect(Object.prototype.hasOwnProperty.call(wrapper.emitted(), 'delete')).toBeTruthy();

        wrapper.destroy();
    });

    it('item is exported', async () => {
        // GIVEN export icon is available in expand item
        const wrapper = factory({
            exportActionAttrs: {
                name: 'Export'
            }
        });

        // WHEN clicking export icon
        wrapper.find('.mdi-export').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN export event is emitted
        expect(wrapper.emitted().export[0][0]).toBeTruthy();

        // -----

        // WHEN clicking edit icon next to title again
        wrapper.find('.mdi-border-color').trigger('click');
        await wrapper.vm.$nextTick();

        // AND editing the title name
        const textInput = wrapper.find('input[type="text"]');
        await textInput.setValue('Title2');

        // AND accepting the edited title
        wrapper.find('.mdi-check').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN new title is visible
        expect(wrapper.find('.expand-title').text()).toEqual('Title2');

        // -----

        // WHEN clicking export icon again
        wrapper.find('.mdi-export').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN export event is emitted
        expect(wrapper.emitted().export[0][1]).toBeFalsy();

        wrapper.destroy();
    });
});
