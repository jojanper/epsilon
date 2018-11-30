/**
 * Simple function to create unique ID fast but minimize the chance that same
 * characters in the same order are created.
 */
function uniqueID() {
    function chr4() {
        return Math.random().toString(16).slice(-4);
    }

    return `${chr4()}${chr4()}-${chr4()}-${chr4()}-${chr4()}-${chr4()}${chr4()}`;
}

export const NotificationMessageTypes = {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error'
};

export class NotificationMessage {
    static createSuccess(data, options) {
        return new NotificationMessage(NotificationMessageTypes.SUCCESS, data, options);
    }

    static createInfo(data, options) {
        return new NotificationMessage(NotificationMessageTypes.INFO, data, options);
    }

    static createWarning(data, options) {
        return new NotificationMessage(NotificationMessageTypes.WARNING, data, options);
    }

    static createError(data, options) {
        return new NotificationMessage(NotificationMessageTypes.ERROR, data, options);
    }

    constructor(type, data, options) {
        this._type = type;
        this._data = data;
        this.id = uniqueID();
        this._options = options;
    }

    get type() {
        return this._type;
    }

    get data() {
        return this._data;
    }

    get timeout() {
        return (this._options && this._options.timeout) ? this._options.timeout : undefined;
    }
}
