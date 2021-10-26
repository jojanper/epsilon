import { NotificationMessage } from './notification';

describe('NotificationMessage', () => {
    it('instance includes unique ID', () => {
        const a = NotificationMessage.createSuccess('A');
        const b = NotificationMessage.createWarning('B');

        expect(a.id).not.toEqual(b.id);
    });

    it('has timeout', () => {
        const options = { timeout: 1000 };
        const obj = NotificationMessage.createSuccess('A', options);
        expect(obj.timeout).toEqual(options.timeout);
    });
});
