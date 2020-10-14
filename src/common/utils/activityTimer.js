// https://dev.to/originalexe/can-you-please-refresh-or-how-we-version-our-single-page-application-335l

const ActivityBasedTimer = () => {
    let globalTimerId = 0;
    const timers = new Map();

    const maybeExecuteTimerCallback = ({ timerId, forced = false }) => {
        const timer = timers.get(timerId);

        const {
            callback,
            interval,
            forcedInterval,
            forcedIntervalId,
            lastExecution
        } = timer;

        const intervalToCheckFor = forced === true ? forcedInterval : interval;

        const now = Date.now();
        if (now - lastExecution < intervalToCheckFor) {
            return;
        }

        const newTimer = { ...timer, lastExecution: now };

        if (forcedIntervalId !== undefined) {
            window.clearInterval(forcedIntervalId);
            newTimer.forcedIntervalId = window.setInterval(() => {
                maybeExecuteTimerCallback({ timerId, forced: true });
            }, forcedInterval);
        }

        timers.set(timerId, newTimer);
        callback({ forced, timerId });
    };

    const setInterval = ({ callback, interval, forcedInterval } = {}) => {
        const timerId = globalTimerId;

        const timer = {
            callback,
            interval,
            lastExecution: Date.now()
        };

        if (forcedInterval !== undefined) {
            timer.forcedInterval = forcedInterval;
            timer.forcedIntervalId = window.setInterval(() => {
                maybeExecuteTimerCallback({ timerId, forced: true });
            }, forcedInterval);
        }

        timers.set(timerId, timer);
        globalTimerId += 1;

        return timerId;
    };

    const clearInterval = timerId => {
        const timer = timers.get(timerId);

        if (timer === undefined) {
            return;
        }

        const { forcedIntervalId } = timer;

        if (forcedIntervalId !== undefined) {
            window.clearInterval(forcedIntervalId);
        }

        timers.delete(timerId);
    };

    const runTimersCheck = () => {
        timers.forEach((_timer, timerId) => {
            maybeExecuteTimerCallback({ timerId });
        });
    };

    return {
        setInterval,
        clearInterval,
        runTimersCheck
    };
};

export default ActivityBasedTimer;
