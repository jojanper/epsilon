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

    /**
     * Get application meta data from remote. Meta data contains information such as version, etc.
     * @returns Observable that on subscription returns the meta data.
     */
    getAppMeta() {
        const options = { responseType, params: { time: Date.now() } };
        return this.network.get(`${this.appUrl}metadata`, options).pipe(
            map(response => response.data)
        );
    }

    /**
     * Request file download from remote.
     *
     * @param {*} file File name.
     * @param {*} params Query parameters, if any.
     * @param {*} settings Request settings.
     * @returns Observable that on subscription returns the file as Blob.
     */
    getFile(file, params = {}, settings = null) {
        const url = `${this.rootUrl}media-download/${file}`;
        const options = { responseType: 'blob', params: { ...params, time: Date.now() } };
        return this.network.get(url, options, settings);
    }

    execCommand(params = {}, postFix = 'exec') {
        const options = { responseType, params: { ...params, time: Date.now() } };
        return this.network.get(`${this.rootUrl}${postFix}`, options);
    }

    uploadFile(file, data, progressCallback) {
        const url = `${this.appUrl}/media-upload`;
        return this.network.uploadFiles(url, [file], data, progressCallback);
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
