import moxios from 'moxios';

import Network from './network';


describe('Network', () => {
    const url = '/foo';
    const network = Network;

    beforeEach(() => {
        moxios.install(Network.network);
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('remote responds with an error message', (done) => {
        moxios.stubRequest(url, {
            status: 404,
            response: { error: 'Error' }
        });

        let data;
        network.get(url).subscribe(() => {}, (err) => {
            ({ data } = err);
        });

        moxios.wait(() => {
            expect(data.error).toEqual('Error');
            done();
        });
    });

    it('supports get', (done) => {
        moxios.stubRequest(url, {
            status: 200,
            response: [
                { id: 1 }
            ]
        });

        let data;
        network.get(url).subscribe((response) => {
            data = response;
        });

        moxios.wait(() => {
            expect(data.length).toEqual(1);
            expect(data[0].id).toEqual(1);
            done();
        });
    });
});
