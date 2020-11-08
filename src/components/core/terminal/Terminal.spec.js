import Vuex from 'vuex';
import { of, throwError } from 'rxjs';
import { mount, createLocalVue } from '@vue/test-utils';

import { terminalMixin } from './terminalMixin';
import DraalTerminal from './Terminal.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

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

function execTerminal(wrapper, data) {
    return new Promise(resolve => wrapper.vm.terminalExec(data, resolve));
}

describe('terminalMixin', () => {
    const { state, store } = createLocalNotificationStore();

    const wrapper = mount(App, {
        localVue,
        store,
        vuetify: getVuetify()
    });

    beforeAll(() => {
        prepareVuetify();
    });

    it('data is provided to mixin', async () => {
        // Terminal receives string data via observable
        const exec = execTerminal(wrapper, of({
            cmddata: 'terminal data1\nterminal data2'
        }));

        // Received data is correct
        let response = await exec;
        expect(response).toEqual(['terminal data1', 'terminal data2']);

        // Data is rendered and visible
        let el = wrapper.find('div.data-screen-text');
        expect(el.text()).toEqual('terminal data1 terminal data2');

        // -----

        // Terminal receives array data via observable
        response = await execTerminal(wrapper, of({
            cmddata: ['response 1', 'response 2']
        }));

        // Received data is correct
        expect(response).toEqual(['response 1', 'response 2']);

        // -----

        // Terminal receives error via observable
        await execTerminal(wrapper, throwError({
            data: {
                errors: ['Error']
            }
        }));

        // Error is reported via notifications
        expect(state.notifications.length).toEqual(1);
        expect(state.notifications[0].type).toEqual('error');
        expect(state.notifications[0].data).toEqual('Error');

        // -----

        // Terminal receives error data via observable.
        // Observable succeeds but actual data reports errors
        response = await execTerminal(wrapper, throwError({
            data: {
                cmderrors: ['error1']
            }
        }));

        // Data error is reported and rendered correctly
        expect(response).toEqual(['error1']);
        el = wrapper.find('div.data-screen-text');
        expect(el.text()).toEqual('error1');

        // -----

        // Terminal data is set directly
        wrapper.vm.setTerminalData(['data 1', 'data 2']);

        // Data is rendered correctly
        el = wrapper.find('div.data-screen-text');
        expect(el.text()).toEqual('data 1 data 2');

        // -----

        // Terminal data is received as observable and actual data is available
        // via text() method which returns Promise.
        response = await execTerminal(wrapper, throwError({
            data: {
                async text() {
                    return JSON.stringify({ cmderrors: ['Errors via text interface'] });
                }
            }
        }));

        // Data is received correctly
        expect(response).toEqual(['Errors via text interface']);
    });
});
