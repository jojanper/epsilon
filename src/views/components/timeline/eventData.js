import { TIMELINE_TYPES } from './schema';

export class EventData {
    constructor(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    get isDirection() {
        return this._data.type === TIMELINE_TYPES.dir;
    }

    get isOnOff() {
        return this._data.type === TIMELINE_TYPES.switch;
    }
}
