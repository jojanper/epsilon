import { mount } from '@vue/test-utils';
import { of } from 'rxjs';

import DraalUploadTerminal from '../UploadTerminal.vue';

describe('DraalUploadTerminal', () => {
    const files = ['This is a file'];
    const dropEvent = getDropEvent('drop', { files });

    setupVuetifyForTests(beforeAll, afterAll);

    it('file is dropped', async () => {
        // GIVEN file upload component
        const wrapper = mount(DraalUploadTerminal, {
            vuetify: getVuetify(),
            propsData: {
                description: 'Upload data',
                uploadFn: (file, data, cb) => {
                    // Update progress
                    cb({
                        loaded: 100,
                        total: 1000
                    });

                    // Return upload response
                    return of({
                        cmddata: [
                            'success'
                        ]
                    });
                }
            }
        });

        // WHEN dropping file content to component
        let el = wrapper.find('.dropbox');
        el.element.dispatchEvent(dropEvent);

        // THEN completion is correct
        expect(wrapper.vm.completed).toEqual(10);

        await wrapper.vm.$nextTick();

        // AND response data is available
        el = wrapper.find('div.data-screen-text');
        expect(el.text()).toEqual('success');
    });
});
