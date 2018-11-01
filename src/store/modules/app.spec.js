import * as appModule from './app';


describe('App module', () => {
    let store;

    beforeEach(() => {
        store = createModuleStore(appModule);
    });

    it('available languages is assigned', async (done) => {
        const obj = [
            {
                lang: 'en',
                title: 'English'
            },
            {
                lang: 'fi',
                title: 'Finnish'
            }
        ];

        await store.dispatch('setLanguages', obj);
        expect(store.getters.appLanguages.length).toEqual(2);
        expect(store.getters.appLanguages[0].lang).toEqual(obj[0].lang);
        expect(store.getters.appLanguages[1].lang).toEqual(obj[1].lang);
        done();
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
