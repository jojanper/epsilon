import { debounce } from '@/common/utils';
import { rules } from '@/components/core/form/rules';

export const RENDER_MODES = {
    text: 'text',
    file: 'file',
    filesystem: 'filesystem'
};

export const fileListingMixin = {
    props: {
        // Remote file query function. Must return observable.
        fileQueryFn: {
            type: Function,
            required: true
        },
        // File extension used to query the file listing from remote.
        fileExt: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Input mode: text, file, filesystem.
         */
        mode: {
            type: String,
            required: false,
            default: RENDER_MODES.file
        }
    },
    data() {
        return {
            items: [],
            search: null,
            RENDER_MODES
        };
    },
    created() {
        // Debounce query to reduce remote calls and smooth the UI behaviour
        this.remoteQuery = debounce(this.remoteQuery, 500);
    },
    watch: {
        search(val) {
            // Determine if remote file query should be performed
            if (val && val !== this.select) {
                this.remoteQuery(val);
            }
        }
    },
    methods: {
        validExtension(value) {
            if (!this.fileExt) {
                return false;
            }

            const target = value || this.fieldValue;
            const params = { ext: this.fileExt };
            if (target && rules.fileext.validate(target, params)) {
                return true;
            }

            return false;
        },

        remoteQuery(value) {
            // Check if query should be applied now
            if (this.validExtension(value)) {
                return;
            }

            // Get file listing
            this.fileQueryFn(value, this.fileExt).subscribe(
                ({ data }) => {
                    if (data.length) {
                        this.items = data;
                    }
                }
            );
        },

        // Use data paste, get from clipboard
        onPaste(evt) {
            this.items = [evt.clipboardData.getData('text/plain')];
        }
    }
};
