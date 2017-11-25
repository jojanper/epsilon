import { shallow } from 'vue-test-utils';
import HelloWorld from '@/components/HelloWorld';


describe('HelloWorld.vue', () => {
    it('should render correct contents', () => {
        const wrapper = shallow(HelloWorld);
        expect(wrapper.find('.hello h1').text()).toEqual('Welcome to Your Vue.js App');
    });
});
