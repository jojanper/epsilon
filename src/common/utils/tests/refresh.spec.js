/* eslint-disable no-plusplus */
import { timer } from '../index';
import AppRefresh from '../refresh';

describe('AppRefresh', () => {
    afterEach(() => {
        AppRefresh.clear();
    });

    it('forced interval support', async done => {
        let callCount = 0;

        // Timeout clearing succeeds (does not crash)
        AppRefresh.clear();

        // Forced interval 200ms, periodic interval 2sec
        AppRefresh.init({
            interval: 2000,
            forcedInterval: 200,
            callback: () => {
                callCount++;
            }
        }).runCheck();

        // After 200ms, callback is triggered
        await timer(200);
        expect(callCount).toEqual(1);

        // After 250ms more, callback is triggered
        await timer(250);
        expect(callCount).toEqual(2);

        // Timers are cleared
        AppRefresh.clear();

        // No callback is triggered since timers are not available
        await timer(150);
        expect(callCount).toEqual(2);

        done();
    });

    it('periodic interval support', async done => {
        let callCount = 0;

        // Timers check succeeds even though no timers are available
        AppRefresh.runCheck();

        // Periodic interval is 100ms, forced interval is 800ms
        AppRefresh.init({
            interval: 100,
            forcedInterval: 8000,
            callback: () => {
                callCount++;
            }
        }).runCheck();

        // Check is executed after 200ms
        await timer(200);
        AppRefresh.runCheck();
        expect(callCount).toEqual(1);

        // Another 200ms elapses
        // No callback is made as timers check is not executed
        await timer(200);
        expect(callCount).toEqual(1);

        // Timers check is executed and callback occurs
        AppRefresh.runCheck();
        expect(callCount).toEqual(2);

        done();
    });
});
