import { shallowMount } from '@vue/test-utils';

import DraalHelloWorld from './HelloWorld.vue';


describe('DraalHelloWorld', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message';
        const wrapper = shallowMount(DraalHelloWorld, {
            propsData: { msg }
        });
        expect(wrapper.text()).toMatch(msg);
    });
});
