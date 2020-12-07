import { BaseObservableObject } from './rxjs';

describe('BaseObservableObject', () => {
    it('new subject to emitted', done => {
        const testObj = BaseObservableObject.createAsSubject();

        let data = null;
        testObj.asPipe().subscribe(response => {
            data = response;
        });

        testObj.setObject('testing');
        expect(data).toEqual('testing');

        testObj.closeSubject();

        testObj.setObject('testing2');
        expect(data).toEqual('testing');

        done();
    });
});
