import DraalFileImport from '../FileImport.vue';

describe('DraalFileImport', () => {
    const files = ['This is a file', 'This is another file'];
    const dropEvent = getDropEvent('drop', { files });
    const tooltipText = 'Import data from file';

    beforeAll(() => {
        prepareVuetify();
        createDataApp();
    });

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalFileImport, {
            ...propsData
        });
    }

    async function fileDialogOpened(props) {
        // GIVEN component
        const wrapper = factory(props);

        // WHEN user clicks icon
        wrapper.find('.mdi-drag').trigger('click');
        await wrapper.vm.$nextTick();

        // THEN dialog is opened
        expect(wrapper.vm.fileDialog).toBeTruthy();
    }

    it('file dialog is opened', async () => {
        fileDialogOpened();
        fileDialogOpened({ tooltipText });
    });

    async function filesDropped(props) {
        // GIVEN multiple files can be dropped
        const wrapper = factory({ multiple: true, ...props });

        // WHEN files are dropped
        wrapper.find('.mdi-drag').element.dispatchEvent(dropEvent);

        // THEN files are received via event
        const event = wrapper.emitted()['file-select'][0][0];
        expect(event[0]).toEqual(files[0]);
        expect(event[1]).toEqual(files[1]);
    }

    it('files are dropped to component', async () => {
        filesDropped();
        filesDropped({ tooltipText });
    });
});
