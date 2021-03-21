import DraalExpandItem from './ExpandItem.vue';

describe('DraalExpandItem', () => {
    beforeAll(() => {
        prepareVuetify();
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

        // WHEN clicking export icon again
        wrapper.find('.mdi-export').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN export event is emitted
        expect(wrapper.emitted().export[0][1]).toBeFalsy();
    });
});
