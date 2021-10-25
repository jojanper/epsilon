import DraalFormGenerator from './Form.vue';
import { storeModule } from '@/store/modules/app';
import { timer } from '@/common/utils';
import { initialize } from '@/components/core/form/vee-validate';


const TEXT_SCHEMA = [{
    type: 'text',
    placeholder: 'Enter text',
    label: 'Text',
    name: 'text',
    rules: 'required',
    debouce: 0
}];

const OPTIONS = {
    submit: 'Submit',
    clear: 'Clear',
    debouncedDisabled: 0
};

describe('DraalFormGenerator', () => {
    beforeAll(() => {
        prepareVuex();
        prepareVuetify();
        createDataApp();
        initialize();
    });

    function factory(propsData = {}, params = {}) {
        const store = createTestStore(storeModule);

        return mountedComponentFactory(DraalFormGenerator, {
            ...propsData
        }, { ...params, store });
    }

    it('text input is submitted', async () => {
        const props = {
            schema: TEXT_SCHEMA,
            options: OPTIONS,
            value: {
                text: null
            }
        };

        const wrapper = factory(props);

        // Set text input
        const editValue = 'My text';
        const textInput = wrapper.find('input[type="text"]');
        await textInput.setValue(editValue);
        await timer(275);

        // Submit form
        const buttons = wrapper.findAll('button');
        await buttons.at(0).trigger('click');

        setTimeout(() => {
            const submitData = wrapper.emitted()['form-data'][0];

            // Data is valid
            expect(submitData[1]).toBeTruthy();

            // Data is as expected
            expect(submitData[0].text).toEqual('My text');

            wrapper.destroy();
        }, 0);
    });
});
