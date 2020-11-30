import { mount } from '@vue/test-utils';

import DraalFileDrop from './FileDrop.vue';

describe('DraalFileDrop', () => {
    const title = 'Drop file to icon';
    const files = ['This is a file', 'This is another file'];
    const dropEvent = getDropEvent('drop', { files });
    const dragEvent = getDropEvent('dragenter', { files });

    it('file is dropped', async () => {
        // GIVEN file drop component
        const wrapper = mount(DraalFileDrop, {
            attachToDocument: true,
            propsData: { title }
        });

        // WHEN dropping file content to component
        const el = wrapper.find('.dropbox');
        el.element.dispatchEvent(dropEvent);

        // THEN drop event is sent with correct content
        expect(wrapper.emitted().fileDrop[0][0]).toEqual(files);

        // -----

        // WHEN triggering dragenter event
        el.element.dispatchEvent(dragEvent);

        // THEN dragging event is emitted
        expect(wrapper.emitted().dragging[0][0]).toBeTruthy();
    });
});
