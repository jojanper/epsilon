import { of, throwError } from 'rxjs';
import { createLocalVue } from '@vue/test-utils';

import { terminalMixin } from './terminalMixin';
import DraalTerminal from './Terminal.vue';
import { timer } from '@/common/utils';
import { storeModule, name } from '@/store/modules/notification';

const GET_NOTIFICATIONS = `${name}/appNotifications`;

function getTestComponent(localVue) {
    return localVue.component('TestTerminal', {
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
}

function execTerminal(wrapper, data) {
    return new Promise(resolve => wrapper.vm.terminalExec(data, resolve));
}

describe('terminalMixin', () => {
    beforeAll(() => {
        prepareVuetify();
        prepareVuex();
    });

    it('data is provided to mixin', async () => {
        const localVue = createLocalVue();
        const App = getTestComponent(localVue);
        const store = createTestStore(storeModule);
        const wrapper = mountedComponentFactory(App, {}, { localVue, store });

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
        const notifications = store.getters[GET_NOTIFICATIONS];
        expect(notifications.length).toEqual(1);
        expect(notifications[0].type).toEqual('error');
        expect(notifications[0].data).toEqual('Error');

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
        await timer(0);

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

        wrapper.destroy();
    });
});
