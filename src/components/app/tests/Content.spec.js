import DraalContentView from '../Content.vue';

describe('DraalContentView', () => {
    it('side menu is rendered', async () => {
        const wrapper = shallowMountedComponentFactory(DraalContentView);

        // Desktop side menu not available
        let elements = wrapper.findAll('.sidebar-offcanvas');
        expect(elements.length).toEqual(0);

        // Switch to desktop viewport
        wrapper.vm.$vuetify.breakpoint.mobile = false;
        await wrapper.vm.$nextTick();

        // Desktop side menu available
        elements = wrapper.findAll('.sidebar-offcanvas');
        expect(elements.length).toEqual(1);
    });
});
