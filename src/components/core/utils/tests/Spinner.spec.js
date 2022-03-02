import DraalSpinner from '../Spinner.vue';

describe('DraalSpinner', () => {
    const text = 'In-progress';

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalSpinner, propsData, {
            slots: {
                spinner: `<div class="spinner">${text}</div>`
            }
        });
    }

    it('spinner is disabled and enabled', async () => {
        const wrapper = factory({
            state: false,
            width: '64',
            height: '64'
        });

        // No spinner
        expect(wrapper.findAll('.spinner-loader').length).toEqual(0);

        // Enable spinner
        await wrapper.setProps({ state: true });

        // Spinner visible
        const el = wrapper.findAll('.spinner-loader');
        expect(el.length).toEqual(1);
        expect(wrapper.find('.spinner').text()).toEqual(text);
    });
});
