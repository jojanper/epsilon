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
    static createSuccess(data) {
        return new NotificationMessage(NotificationMessageTypes.SUCCESS, data);
    }

    static createInfo(data) {
        return new NotificationMessage(NotificationMessageTypes.INFO, data);
    }

    static createWarning(data) {
        return new NotificationMessage(NotificationMessageTypes.WARNING, data);
    }

    static createError(data) {
        return new NotificationMessage(NotificationMessageTypes.ERROR, data);
    }

    constructor(type, data) {
        this._type = type;
        this._data = data;
        this.id = uniqueID();
    }

    get type() {
        return this._type;
    }

    get data() {
        return this._data;
    }
}
