import moxios from 'moxios';

import Network from '@/common/network';
import * as appModule from './app';


describe('App module', () => {
    let store;

    beforeEach(() => {
        store = createModuleStore(appModule);
        moxios.install(Network.network);
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('new application version is reloaded', () => {
        spyOn(window.location, 'reload');
        store.dispatch('reloadApp');
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('new application version is checked', async done => {
        // 2 appplication version queries are performed
        store.dispatch('checkVersion');
        store.dispatch('checkVersion');

        moxios.wait(async () => {
            const req1 = moxios.requests.at(0);
            await req1.respondWith({
                status: 200,
                response: { data: [{ version: '0.0.1' }] }
            });

            // No new version is available for 1st query
            expect(store.getters.newAppVersionAvailable).toBeFalsy();
            expect(store.getters.appVersion).toEqual('0.0.1');

            const req2 = moxios.requests.at(1);
            await req2.respondWith({
                status: 200,
                response: { data: [{ version: '0.0.2' }] }
            });

            // 2nd query results in new available version
            expect(store.getters.newAppVersionAvailable).toBeTruthy();

            done();
        });
    });

    it('language is changed', async done => {
        let counter = 0;

        moxios.stubRequest('locales/fi.json', {
            status: 200,
            response: {}
        });

        const i18 = {
            locale: 'en',
            messages: {
                en: {}
            },
            setLocaleMessage(newLang, messages) {
                counter += 1;
                i18.messages[newLang] = messages;
            }
        };

        // GIVEN new locale settings
        const obj = {
            lang: 'fi',
            instance: i18
        };

        // WHEN locale is changed
        store.dispatch('setLang', obj);

        moxios.wait(async () => {
            // THEN new locale is set
            expect(i18.locale).toEqual(obj.lang);

            // AND locale messages assignment was called
            expect(counter).toEqual(1);

            // AND new locale messages are available
            expect(i18.messages.fi).toBeDefined();

            // -----

            // WHEN locate is changed again (to same locale in this case)
            await store.dispatch('setLang', obj);

            // THEN no new locale messages assignment occurs
            expect(counter).toEqual(1);

            done();
        });
    });
});
