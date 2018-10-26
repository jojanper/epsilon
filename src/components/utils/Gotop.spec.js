import { shallowMount } from '@vue/test-utils';

import DraalGo2Top from './Gotop.vue';


describe('DraalGo2Top', () => {
    it('renders correctly', (done) => {
        const wrapper = shallowMount(DraalGo2Top, {
            attachToDocument: true
        });

        // On initial render, component is not visible
        const element = wrapper.findAll('.go-top-invisible');
        expect(element.length).toEqual(1);

        // When scroll position increases above threshold
        window.scrollY = 300;

        wrapper.vm.$nextTick(() => {
            // Scroll handler is called and component becomes visible
            wrapper.vm.scrollHandler();
            expect(wrapper.vm.isVisible).toBeTruthy();

            // When component is clicked
            const el = wrapper.findAll('.go-top');
            spyOn(window, 'scrollTo');
            el.at(0).trigger('click');

            // Screen is scrolled back to top
            expect(window.scrollTo).toHaveBeenCalled();

            wrapper.destroy();

            done();
        });
    });
});
