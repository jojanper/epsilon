/* eslint-disable no-restricted-syntax */
import moxios from 'moxios';

import Network from './network';

const RESPONSE = {
    status: 200,
    response: [
        { id: 1 }
    ]
};

describe('Network', () => {
    const url = '/foo';
    const network = Network;

    beforeEach(() => {
        moxios.install(Network.network);
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('remote responds with an error message', done => {
        moxios.stubRequest(url, {
            status: 404,
            response: { error: 'Error' }
        });

        let data;
        network.get(url).subscribe(() => { }, err => {
            ({ data } = err);
        });

        moxios.wait(() => {
            expect(data.error).toEqual('Error');
            done();
        });
    });

    it('supports get', done => {
        moxios.stubRequest(url, RESPONSE);

        let data;
        network.get(url, {}, { fullResponse: true }).subscribe(response => {
            ({ data } = response);
        });

        moxios.wait(() => {
            expect(data.length).toEqual(1);
            expect(data[0].id).toEqual(1);
            done();
        });
    });

    it('supports uploadFiles', async done => {
        let data;

        // File upload with progress callback
        const uploadProgress = () => { };
        network.uploadFiles(url, 'this is a file', uploadProgress).subscribe(response => {
            data = response;
        });

        // Plain file upload
        network.uploadFiles(url, ['this is another file']).subscribe(() => { });

        moxios.wait(async () => {
            const request = moxios.requests.at(0);
            await request.respondWith(RESPONSE);

            // Data entries must match the expected and upload progress defined
            const formData = request.config.data;
            for (const entry of formData.entries()) {
                expect(entry[0]).toEqual('files[0]');
                expect(entry[1]).toEqual('this is a file');
            }
            expect(request.config.onUploadProgress).toBeDefined();
            expect(data.length).toEqual(1);
            expect(data[0].id).toEqual(1);

            const request2 = moxios.requests.at(1);
            await request2.respondWith(RESPONSE);

            // Data entries must match the expected and upload progress not defined
            const formData2 = request2.config.data;
            for (const entry of formData2.entries()) {
                expect(entry[0]).toEqual('files[0]');
                expect(entry[1]).toEqual('this is another file');
            }
            expect(request2.config.onUploadProgress).toBeUndefined();

            done();
        });
    });
});
