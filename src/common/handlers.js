
export const NotificationMessageTypes = {
    SUCCESS: 'success'
};

export class NotificationMessage {
    static createSuccess(data) {
        return new NotificationMessage(NotificationMessageTypes.SUCCESS, data);
    }

    constructor(type, data) {
        this._type = type;
        this._data = data;
    }

    get type() {
        return this._type;
    }

    get data() {
        return this._data;
    }
}
