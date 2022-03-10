import DraalTooltip from '../Tooltip.vue';

describe('DraalTooltip', () => {
    setupVuetifyForTests(beforeAll, afterAll);

    const listeners = {
        scroll: () => { }
    };

    function factory(propsData = {}, options = {}) {
        return mountedComponentFactory(DraalTooltip, propsData, options);
    }

    it('wheel event is requested', async () => {
        const wrapper = factory({
            name: 'Tooltip text',
            icon: 'mdi-magnify-minus-outline',
            position: ''
        }, { listeners });

        await wrapper.find('button').trigger('wheel');

        expect(wrapper.emitted().scroll[0].length).toEqual(1);
    });
});
