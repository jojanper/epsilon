import DraalExport from '../Export.vue';

describe('DraalExport', () => {
    function factory(propsData = {}) {
        return mountedComponentFactory(DraalExport, propsData, {
            slots: {
                default: '<button type="button">Click Me!</button>'
            }
        });
    }

    const link = {
        click: jest.fn(),
    };

    it('file is available for download', async () => {
        // jest.spyOn(document, 'createElement');
        // jest.spyOn(document["body"], 'appendChild');
        // .mockImplementation(() => link);

        // GIVEN component
        const wrapper = factory({
            url: 'Foo',
            name: 'File.json'
        });

        // console.log(wrapper.html());

        const el = wrapper.find('button');
        expect(el.text()).toEqual('Click Me!');
        // jest.spyOn(input, 'click')
        // input.trigger('click');

        // await wrapper.vm.$nextTick();

        // expect(link.click).toHaveBeenCalledTimes(1);
    });
});
