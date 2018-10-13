import { NotificationMessage } from './handlers';


describe('NotificationMessage', () => {
    it('instance includes unique ID', () => {
        const a = NotificationMessage.createSuccess('A');
        const b = NotificationMessage.createWarning('B');

        expect(a.id).not.toEqual(b.id);
    });
});
