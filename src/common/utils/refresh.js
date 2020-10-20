import ActivityBasedTimer from './activityTimer';

class AppRefresh {
    constructor() {
        this._timerId = null;
        this.activityTimer = ActivityBasedTimer();
    }

    /**
     * Initialize application callback timer. The interval timer will execute provided
     * that runCheck is called regularly. The call can be placed for example, to router.
     * The forced interval will execute at specified intervals, its operation is not
     * bind to runCheck call. This approach will save device battery, callback will be
     * triggered only when there is user activity (via runCheck) and forced callback will
     * be triggered typically after long periods of time.
     *
     * @param {*} interval Interval when callback should be called. Default is once every 15 minutes.
     * @param {*} forcedInterval Forced interval when callback is called. Default is once per day.
     * @param {*} callback Timer callback.
     */
    init({ interval = 1000 * 60 * 15, forcedInterval = 1000 * 60 * 60 * 24, callback }) {
        this._timerId = this.activityTimer.setInterval({
            callback,
            interval,
            forcedInterval
        });

        return this;
    }

    /**
     * Run timer checks.
     */
    runCheck() {
        this.activityTimer.runTimersCheck();
        return this;
    }

    /**
     * Clear timer checks.
     */
    clear() {
        this.activityTimer.clearInterval(this._timerId);
    }
}

const service = new AppRefresh();

export default service;
