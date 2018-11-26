import axios from 'axios';
import { from, throwError } from 'rxjs';
import { catchError, map, first } from 'rxjs/operators';


class Network {
    constructor() {
        this.network = axios;
    }

    get(url, options = {}) {
        return this.execute('get', [url, options]);
    }

    execute(method, args) {
        const promise = this.network[method](...args);

        return from(promise).pipe(
            first(),
            map(response => response.data),
            catchError(err => throwError(err.response))
        );
    }
}

const service = new Network();

export default service;
