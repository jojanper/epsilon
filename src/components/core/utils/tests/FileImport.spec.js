import DraalFileImport from '../FileImport.vue';

describe('DraalFileImport', () => {
    const files = ['This is a file', 'This is another file'];
    const dropEvent = getDropEvent('drop', { files });

    beforeAll(() => {
        prepareVuetify();
        createDataApp();
    });

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalFileImport, {
            tooltipText: 'Import data from file',
            ...propsData
        });
    }

    it('file dialog is opened', async () => {
        // GIVEN component
        const wrapper = factory();

        // WHEN user clicks icon
        wrapper.find('.mdi-drag').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN dialog is opened
        expect(wrapper.vm.fileDialog).toBeTruthy();
    });

    it('files are dropped to component', async () => {
        // GIVEN multiple files can be dropped
        const wrapper = factory({ multiple: true });

        // WHEN files are dropped
        wrapper.find('.mdi-drag').element.dispatchEvent(dropEvent);

        // THEN files are received via event
        const event = wrapper.emitted()['file-select'][0][0];
        expect(event[0]).toEqual(files[0]);
        expect(event[1]).toEqual(files[1]);
    });
});
