import DraalIconDialog from './IconDialog.vue';

describe('DraalIconDialog', () => {
    beforeAll(() => {
        prepareVuetify();
        createDataApp();
    });

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalIconDialog, {
            tooltipText: 'Icon dialog',
            dialogTitle: 'Tile',
            dialogContent: 'Content',
            ...propsData
        }, { stubs: { DraalDialog: true } });
    }

    it('icon is clicked', async () => {
        // GIVEN component
        const wrapper = factory();

        // WHEN user clicks icon
        wrapper.find('.mdi-information-outline').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN dialog is opened
        expect(wrapper.vm.helpDialog).toBeTruthy();

        wrapper.destroy();
    });
});
