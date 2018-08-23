import axios from 'axios';
import { from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


class Network {
    constructor() {
        this.network = axios;
    }

    get(url) {
        return this.execute('get', [url]);
    }

    execute(method, args) {
        const promise = this.network[method](...args);

        return from(promise).pipe(
            map(response => response.data),
            catchError(err => throwError(err.response))
        );
    }
}

const service = new Network();

export default service;
