import { shallowMount } from '@vue/test-utils';

import DraalFooter from './Footer.vue';


describe('DraalFooter', () => {
    it('renders correctly', () => {
        const props = {
            link: 'https://google.com',
            title: 'Footer link'
        };
        const wrapper = shallowMount(DraalFooter, {
            propsData: props
        });
        const elements = wrapper.findAll('a');
        expect(elements.length).toEqual(1);
        expect(elements.at(0).text()).toMatch(props.title);
    });
});
