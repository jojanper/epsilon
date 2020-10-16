import { of } from 'rxjs';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import { terminalMixin } from './terminalMixin';
import DraalTerminal from './Terminal.vue';

describe('terminalMixin', () => {
    it('terminalExec', done => {
        const localVue = createLocalVue();

        const App = localVue.component('TestTerminal', {
            mixins: [terminalMixin],
            components: {
                DraalTerminal
            },
            template: `
              <div>
              <draal-terminal :dataInput="terminalData"></draal-terminal>
              </div>
            `
        });

        const wrapper = shallowMount(App, {
            localVue
            // mixins: [terminalMixin],
        });

        // console.log(wrapper.vm);

        const data = of({
            cmddata: 'terminal data'
        });

        wrapper.vm.terminalExec(data, response => {
            expect(response).toEqual(['terminal data']);
            done();
        });
    });
});
