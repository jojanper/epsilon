import * as appModule from './app';


describe('App module', () => {
    let store;

    beforeEach(() => {
        store = createModuleStore(appModule);
    });

    it('language is changed', async (done) => {
        const i18 = {
            locale: 'en'
        };

        const obj = {
            lang: 'fi',
            instance: i18
        };

        await store.dispatch('setLang', obj);
        expect(i18.locale).toEqual(obj.lang);
        done();
    });
});
