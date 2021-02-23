import { map } from 'rxjs/operators';

import Network from '../network';

const responseType = 'json';

class AudioApi {
    constructor(network) {
        this.rootUrl = '/api/audio/v1/';
        this.appUrl = '/api/app/metadata';
        this.network = network;
    }

    getAppMeta() {
        const options = { responseType, params: { time: Date.now() } };
        return this.network.get(`${this.appUrl}`, options).pipe(
            map(response => response.data[0])
        );
    }

    getFile(url, params = {}, settings = null) {
        const options = { responseType: 'blob', params: { ...params, time: Date.now() } };
        return this.network.get(`${this.rootUrl}${url}`, options, settings);
    }

    execCommand(params = {}, postFix = 'exec') {
        const options = { responseType, params: { ...params, time: Date.now() } };
        return this.network.get(`${this.rootUrl}${postFix}`, options);
    }

    uploadFile(file, progressCallback) {
        return this.network.uploadFiles(`${this.rootUrl}parse`, [file], progressCallback);
    }
}

const service = new AudioApi(Network);

export default service;
