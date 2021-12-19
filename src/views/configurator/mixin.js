import { of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';

import {
    LOCAL_AUDIOFILE_INPUT, FILE_DATA_QUERY_INPUT, FILE_OPEN_INPUT, TIMELINE_INPUT
} from '@/components/core/form/input';
import { AudioApi } from '@/common/api';
import { notificationActions } from '@/store/helpers';
import { NotificationMessage } from '@/common/models';

const ICONSIZE = 'large';

export const configuratorMixin = {
    data() {
        return {
            queryFailure: false,

            toolIconAttrs: {
                position: 'top',
                iconSize: ICONSIZE
            },

            options: {
                submit: this.$t('configuratorPage.createRec'),
                clear: this.$t('configuratorPage.clearForm')
            }
        };
    },

    methods: {
        ...notificationActions,

        addMessage(msg, type = 'Success', timeout = 3000) {
            const method = `create${type}`;
            this.addNotification(NotificationMessage[method](msg, { timeout }));
        },

        submit(data) {
            /* eslint-disable-next-line */
            console.log('Submit data', data);
        },

        wavQuery(filename) {
            return AudioApi.wavInfo(encodeURIComponent(filename)).pipe(
                catchError(() => ({ data: {} }))
            );
        },

        fileQuery(prefix, ext, params = {}) {
            return AudioApi.fileList(prefix, ext, params).pipe(
                catchError(() => ({ data: [] }))
            );
        },

        dataQuery(file) {
            if (this.queryFailure) {
                const timeout = 5000;
                const msg = `Error in parsing file ${file.name || file.path}`;
                this.addNotification(NotificationMessage.createError(msg, { timeout }));

                this.queryFailure = false;
                return throwError(() => [msg]);
            }

            this.queryFailure = true;

            return of([
                { uuid: 'UUID 1' },
                { uuid: 'UUID 2' },
                { uuid: 'UUID 3' },
                { uuid: 'UUID 4' },
                { uuid: 'UUID 5' },
                { uuid: 'Set your own ID', custom: true }
            ]).pipe(delay(2500));
        },

        setSchemaCallbacks(schema) {
            schema.forEach(item => {
                const data = item;

                if (item.type === LOCAL_AUDIOFILE_INPUT) {
                    data.dataQuery = this.wavQuery.bind(this);
                    data.fileQueryFn = this.fileQuery.bind(this);
                } else if (item.type === FILE_DATA_QUERY_INPUT) {
                    data.dataQuery = this.dataQuery.bind(this);
                    data.fileQueryFn = this.fileQuery.bind(this);
                } else if (item.type === FILE_OPEN_INPUT) {
                    data.fileQueryFn = this.fileQuery.bind(this);
                } else if (item.type === TIMELINE_INPUT) {
                    data.toolbarIconSize = ICONSIZE;
                }
            });
        }
    }
};
