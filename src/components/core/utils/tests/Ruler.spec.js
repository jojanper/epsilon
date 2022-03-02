import DraalRuler from '../Ruler.vue';

describe('DraalRuler', () => {
    function factory(propsData = {}) {
        return mountedComponentFactory(DraalRuler, propsData);
    }

    it('ruler grid is rendered from grid', () => {
        const wrapper = factory({
            rulerWidth: 292.4,
            zoom: 8
        });

        const el = wrapper.findAll('.cm');
        expect(el.length).toEqual(148);

        // Last item does not have any timestamp content
        const { style } = el.at(el.length - 1).attributes();
        expect(style).toContain('--content: \'\';');
    });

    it('ruler grid is rendered from width', () => {
        const wrapper = factory({
            rulerWidth: 250,
            zoomGrid: [10],
            units: 's'
        });

        const el = wrapper.findAll('.cm');
        expect(el.length).toEqual(11);

        // Last item timestamp is correctly reported
        const { style } = el.at(el.length - 1).attributes();
        expect(style).toContain('--content: \'250s\';');
    });

    it('ruler grid is rendered with zoom factor', () => {
        const wrapper = factory({
            rulerWidth: 250,
            zoomGrid: [10],
            units: 's',
            zoom: 2
        });

        // Timeline is created and zoom event is emitted
        expect(wrapper.findAll('.cm').length).toEqual(21);
        expect(wrapper.emitted()['zoom-level'][0][0]).toEqual(2);
        expect(wrapper.emitted().resize).toEqual(undefined);

        // Resize event is emitted
        wrapper.vm.onResize();
        expect(wrapper.emitted().resize.length).toEqual(1);
    });
});
