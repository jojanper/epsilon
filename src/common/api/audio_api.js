import { map } from 'rxjs/operators';

import Network from '../network';

const responseType = 'json';

class AudioApi {
    constructor(network) {
        this.rootUrl = '/api/audio/v1/';
        this.appUrl = '/api/app/';
        this.mediaUrl = '/api/media';
        this.network = network;
    }

    getAppMeta() {
        const options = { responseType, params: { time: Date.now() } };
        return this.network.get(`${this.appUrl}metadata`, options).pipe(
            map(response => response.data)
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
        return this.network.uploadFiles(`${this.appUrl}/media-upload`, [file], progressCallback);
    }

    // Query WAVE info data from remote
    wavInfo(filename) {
        const params = { filename };
        return this.network.post(`${this.mediaUrl}/wave`, params);
    }

    // Query file listing from remote
    fileList(prefix, ext, params = {}) {
        const options = {
            params: {
                path: prefix, ext, time: Date.now(), ...params
            }
        };
        return this.network.get(`${this.mediaUrl}/file-listing`, options);
    }
}

const service = new AudioApi(Network);

export default service;
