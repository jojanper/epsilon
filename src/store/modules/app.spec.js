import moxios from 'moxios';

import * as appModule from './app';
import Network from '@/common/network';


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
        // 3 appplication version queries are performed
        store.dispatch('checkVersion');
        store.dispatch('checkVersion');
        store.dispatch('checkVersion');

        moxios.wait(async () => {
            const req1 = moxios.requests.at(0);
            await req1.respondWith({
                status: 200,
                response: { data: { version: '0.0.1' } }
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
            expect(store.getters.appVersion).toEqual('0.0.1');

            const req3 = moxios.requests.at(2);
            await req3.respondWith({
                status: 200,
                response: { data: [{ version: '0.0.2' }] }
            });

            // 3rd query results in same response
            // - New version is available
            // - Version data still points to original version
            expect(store.getters.newAppVersionAvailable).toBeTruthy();
            expect(store.getters.appVersion).toEqual('0.0.1');

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

            // AND current locale is set correctly
            expect(store.getters.appLang).toEqual(obj.lang);

            // -----

            // WHEN locate is changed again (to same locale in this case)
            await store.dispatch('setLang', obj);

            // THEN no new locale messages assignment occurs
            expect(counter).toEqual(1);

            done();
        });
    });

    it('timeline length is saved', () => {
        store.dispatch('saveTimelineLength', { id: 'test', length: 234 });
        expect(store.getters.getTimelineLength('test')).toEqual(234);
    });

    it('config files are stored', () => {
        const data = { bin: [1, 2, 3] };
        store.dispatch('setConfigFiles', data);
        expect(store.getters.getConfigFiles('bin')).toEqual([1, 2, 3]);
    });

    it('getUtilsViewProperties', () => {
        expect(store.getters.getUtilsViewProperties('fileProperties').length).toEqual(2);
    });
});
