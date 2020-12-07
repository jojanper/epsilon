import { Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

/**
 * Base class for managing an object as observable.
 */
export class BaseObservableObject {
    observable;

    #destroy = false;

    #subject = null;

    static createAsSubject() {
        return new BaseObservableObject(new Subject());
    }

    constructor(subject) {
        this.#subject = subject;
        this.observable = this.#subject.asObservable();
    }

    /**
     * Return observable that closes when `closeSubject` method is called.
     */
    asPipe() {
        return this.observable.pipe(
            takeWhile(() => this.#destroy === false)
        );
    }

    /**
     * Close subject from emitting further values.
     */
    closeSubject() {
        this.#destroy = true;
    }

    /**
     * Set next object.
     */
    setObject(subject) {
        this.#subject.next(subject);
    }
}
