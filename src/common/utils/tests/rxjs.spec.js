import { BaseObservableObject } from '../rxjs';

describe('BaseObservableObject', () => {
    it('new subject to emitted', done => {
        const testObj = BaseObservableObject.createAsSubject();

        let data = null;
        testObj.asPipe().subscribe(response => {
            data = response;
        });

        testObj.send('testing');
        expect(data).toEqual('testing');

        testObj.close();

        testObj.send('testing2');
        expect(data).toEqual('testing');

        done();
    });
});
