import DraalFileDialog from './FileDialog.vue';

describe('DraalFileDialog', () => {
    beforeAll(() => {
        prepareVuetify();
        createDataApp();
    });

    function factory(propsData) {
        return mountedComponentFactory(DraalFileDialog, {
            ...propsData
        });
    }

    it('dialog is opened', async () => {
        // GIVEN file dialog component with possibility to select multiple files
        const wrapper = factory({ value: false, multiple: true });

        // Return some dummy file info
        jest.spyOn(wrapper.vm, 'getFiles')
            .mockImplementation(() => [
                {
                    type: 'audio/wav',
                    size: 1000
                }
            ]);

        // No file dialog open yet
        expect(wrapper.vm.open).toBeFalsy();

        // WHEN setting the prop to open state
        await wrapper.setProps({ value: true });

        const input = wrapper.find('input');

        // THEN multiple file can be selected
        expect(input.html()).toEqual('<input type="file" multiple="multiple" class="d-none">');

        // AND file dialog is open
        expect(wrapper.vm.open).toBeTruthy();

        // -----

        // WHEN user closes file dialog with selected files
        input.trigger('change');

        // THEN event is emitted
        const files = wrapper.emitted()['file-select'][0][0];

        // AND received file data is as expected
        expect(files.length).toEqual(1);
        expect(files[0].type).toEqual('audio/wav');
        expect(files[0].size).toEqual(1000);
        expect(wrapper.vm.open).toBeFalsy();

        wrapper.destroy();
    });

    it('dialog is canceled', async () => {
        // GIVEN file dialog component
        const wrapper = factory({ value: false });

        // THEN file dialog is still closed and no blur handle has been set
        expect(wrapper.vm.onfocus).toBeNull();

        // -----

        // WHEN opening file dialog
        spyOn(wrapper.vm, 'clicked').and.callThrough();
        await wrapper.setProps({ value: true });

        // AND click event occurs
        const input = wrapper.find('input');
        input.trigger('click');

        // THEN file dialog is open
        expect(wrapper.vm.open).toBeTruthy();

        // AND click event receiver has been called
        expect(wrapper.vm.clicked).toHaveBeenCalled();

        // -----

        // WHEN blur effect is called
        document.body.onfocus();

        // THEN file dialog has been closed
        expect(wrapper.vm.open).toBeFalsy();

        wrapper.destroy();
    });

    it('file is extracted from event', async () => {
        const wrapper = factory({ open: false });

        const file = {
            type: 'audio/wav',
            size: 1000
        };

        const event = {
            target: {
                files: [file]
            }
        };

        expect(wrapper.vm.getFiles(event)).toEqual([file]);

        wrapper.destroy();
    });
});
