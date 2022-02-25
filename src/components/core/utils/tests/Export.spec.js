import DraalExport from '../Export.vue';

describe('DraalExport', () => {
    const text = 'Click Me!';

    function factory(propsData = {}) {
        return mountedComponentFactory(DraalExport, propsData, {
            slots: {
                default: `<button type="button">${text}</button>`
            }
        });
    }

    it('file is available for download', async () => {
        const wrapper = factory({
            url: 'Foo',
            name: 'File.json'
        });

        expect(wrapper.find('button').text()).toEqual(text);
    });
});
