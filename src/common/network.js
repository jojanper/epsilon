import axios from 'axios';
import { from, throwError } from 'rxjs';
import { catchError, map, first } from 'rxjs/operators';

class Network {
    constructor() {
        this.network = axios;
    }

    get(url, options = {}, settings = null) {
        return this.execute('get', [url, options], settings);
    }

    post(url, params = {}, settings = null) {
        return this.execute('post', [url, params], settings);
    }

    uploadFiles(url, files, data, progressCallback) {
        const options = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        if (progressCallback) {
            options.onUploadProgress = progressCallback;
        }

        const formData = new FormData();
        const inFiles = Array.isArray(files) ? files : [files];
        inFiles.forEach((file, i) => formData.append(`files[${i}]`, file));

        // Attach the associated data
        if (data) {
            formData.append('data', JSON.stringify(data));
        }

        return this.execute('post', [url, formData, options]);
    }

    execute(method, args, settings) {
        const promise = this.network[method](...args);

        return from(promise).pipe(
            first(),
            map(response => ((settings && settings.fullResponse) ? response : response.data)),
            catchError(err => throwError(err.response))
        );
    }
}

const service = new Network();

export default service;
