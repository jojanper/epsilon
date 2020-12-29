import { Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

/**
 * Base class for managing an object as observable.
 */
export class BaseObservableObject {
    observable;

    #destroy = false;

    #subject = null;

    /**
     * Underlying observable is based on Subject.
     * No initial value or replay behavior.
     */
    static createAsSubject() {
        return new BaseObservableObject(new Subject());
    }

    constructor(subject) {
        this.#subject = subject;
        this.observable = this.#subject.asObservable();
    }

    /**
     * Return observable that closes when `close` method is called.
     */
    asPipe() {
        return this.observable.pipe(
            takeWhile(() => this.#destroy === false)
        );
    }

    /**
     * Close object from emitting further values.
     */
    close() {
        this.#destroy = true;
    }

    /**
     * Send next object to subscribed listeners.
     *
     * @param {*} subject Data for notifications.
     */
    send(subject) {
        this.#subject.next(subject);
    }
}
