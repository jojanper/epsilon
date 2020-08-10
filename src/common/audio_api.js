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

    getEncAudioMP4(params = {}) {
        return this.getFile('enc', params);
    }

    execCommand(params = {}, postFix = 'exec') {
        return this.network.get(`${this.rootUrl}${postFix}`, { responseType: 'json', params: { ...params, time: Date.now() } });
    }

    remoteBranches(params = {}) {
        return this.execCommand(params, 'branches');
    }

    remoteTargets(product, branch, params = {}) {
        return this.execCommand({ ...params, branch }, `manifest/${product}`);
    }

    createTarget(product, branch, target, params = {}) {
        return this.getFile(`create/${product}/${target}`, { ...params, branch }, { fullResponse: true });
    }

    createRelease(product, branch, target, params = {}) {
        return this.execCommand({ ...params, branch }, `release/${product}/${target}`);
    }

    uploadFile(file, progressCallback) {
        return this.network.uploadFiles(`${this.rootUrl}parse`, [file], progressCallback);
    }
}

const service = new AudioApi(Network);

export default service;
