import { notificationActions } from '@/store/helpers';
import { NotificationMessage } from '@/common/models';

export const terminalMixin = {
    data() {
        return {
            terminalData: [],
            processing: false
        };
    },
    methods: {
        ...notificationActions,

        terminalExec(observable) {
            this.processing = true;
            this.clearTerminalData();
            observable.subscribe(this.renderTerminalResponse, this.renderTerminalError);
        },

        async renderTerminalResponse(response, error = false) {
            let targetData = null;

            // Look for error data
            if (error) {
                // These errors will be shown as notification messages
                if (response.data.errors) {
                    response.data.errors.forEach(err => this.addNotification(NotificationMessage.createError(err)));
                } else {
                    // Look for command error data
                    targetData = response.data.cmderrors;
                    if (!targetData) {
                        try {
                            const data = JSON.parse(await response.data.text());
                            targetData = data.cmderrors;
                            /* eslint-disable-next-line */
                        } catch (e) { }
                    }
                }
            } else {
                // Data from command that was executed
                targetData = Array.isArray(response.cmddata) ? response.cmddata : [response.cmddata];
            }

            if (targetData) {
                targetData.flatMap(item => item.split('\n')).forEach(item => this.terminalData.push(item));
            }

            this.processing = false;
        },

        renderTerminalError(response) {
            this.renderTerminalResponse(response, true);
        },

        clearTerminalData() {
            this.terminalData.splice(0, this.terminalData.length);
        }
    }
};
