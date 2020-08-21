import { map } from 'rxjs/operators';

import Network from './network';

class AudioApi {
    constructor(network) {
        this.rootUrl = '/api/audio/v1/';
        this.appUrl = '/api/app/metadata';
        this.network = network;
    }

    getAppMeta() {
        const options = { responseType: 'json', params: { time: Date.now() } };
        return this.network.get(`${this.appUrl}`, options).pipe(
            map(response => response.data[0])
        );
    }

    getFile(url, params = {}, settings = null) {
        return this.network.get(`${this.rootUrl}${url}`, { responseType: 'blob', params: { ...params, time: Date.now() } }, settings);
    }

    execCommand(params = {}, postFix = 'exec') {
        return this.network.get(`${this.rootUrl}${postFix}`, { responseType: 'json', params: { ...params, time: Date.now() } });
    }

    uploadFile(file, progressCallback) {
        return this.network.uploadFiles(`${this.rootUrl}parse`, [file], progressCallback);
    }
}

const service = new AudioApi(Network);

export default service;
