import * as appModule from './app';


describe('App module', () => {
    let store;

    beforeEach(() => {
        store = createModuleStore(appModule);
    });

    it('language is changed', async (done) => {
        let counter = 0;

        const i18 = {
            locale: 'en',
            messages: {
                en: {}
            },
            setLocaleMessage(newLang, messages) {
                counter++;
                i18.messages[newLang] = messages;
            }
        };

        // GIVEN new locale settings
        const obj = {
            lang: 'fi',
            instance: i18
        };

        // WHEN locale is changed
        await store.dispatch('setLang', obj);

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
