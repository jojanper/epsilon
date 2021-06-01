import { debounce } from '@/common/utils';
import { rules } from '@/components/core/form/rules';
import { appComputed } from '@/store/helpers';

export const RENDER_MODES = {
    text: 'text',
    file: 'file',
    filesystem: 'filesystem'
};

/**
 * List files in selection list. Files may be queried from external source or
 * store provides data list updates. These 2 methods are mutually exclusive, only
 * one is operating depending on the component configuration.
 */
export const fileListingMixin = {
    props: {
        /**
         * Remote file query function. Must return observable.
         */
        fileQueryFn: {
            type: Function,
            required: false
        },
        /**
         * File extension used to query the file listing from external source.
         */
        fileExt: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * Remote file query options.
         */
        fileOptions: {
            required: false,
            default: () => { }
        },
        /**
         * Input mode: text, file, filesystem.
         */
        mode: {
            type: String,
            required: false,
            default: RENDER_MODES.file
        },
        /**
         * Store ID for updating the selection items list.
         */
        storeId: {
            type: String,
            required: false,
            default: ''
        },
        /**
         * File listing cache status. Cache enabled by default.
         */
        fileCache: {
            type: Boolean,
            required: false,
            default: true
        },
        /**
         * Remote file query debounce.
         */
        remoteDebounce: {
            type: Number,
            required: false,
            default: 600
        }
    },
    data() {
        return {
            items: [],
            search: null,
            RENDER_MODES,
            fileInputAttrs: this.getFileSystemInputAttrs()
        };
    },
    created() {
        // Debounce query to reduce remote calls and smooth the UI behaviour
        this.remoteQuery = debounce(this.remoteDataQuery, this.remoteDebounce);

        if (this.fieldValue) {
            this.setItems(this.fieldValue);
        }

        // Set selection list available from store
        if (this.storeId) {
            const items = this.configFiles;
            if (items.length) {
                this.setItems(items);
            }
        }
    },
    computed: {
        // Store getter to config files
        getConfigFiles: appComputed.getConfigFiles,

        // Get specified config files
        configFiles() {
            return this.storeId ? this.getConfigFiles(this.storeId) : [];
        }
    },
    watch: {
        search(val) {
            // Determine if remote file query should be performed
            if (this.fileQueryFn && val && val !== this.select && val !== this.fieldValue) {
                this.remoteQuery(val);
            }
        },

        // Update selection list when store list changes
        configFiles(newVal) {
            if (newVal.length) {
                // Reset also the cached items
                if (this.$refs.autocomplete) {
                    this.$refs.autocomplete.cachedItems = newVal;
                }

                this.items = newVal;
            }
        }
    },
    methods: {
        // Selection component attributes for RENDER_MODES.filesystem mode
        getFileSystemInputAttrs() {
            const attrs = this.getInputAttrs();

            // Enable cache when explicitly requested
            if (this.mode === RENDER_MODES.filesystem && this.fileCache === true) {
                attrs['cache-items'] = true;
            }

            return attrs;
        },

        // Set items in the selection list
        setItems(data) {
            this.items = Array.isArray(data) ? data : [data];
        },

        // Check if specified input is valid data
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

        // Query files data from external source
        remoteDataQuery(value) {
            // Check if query should be applied now
            if (this.validExtension(value)) {
                return;
            }

            // Get file listing
            this.fileQueryFn(value, this.fileExt, this.fileOptions).subscribe(
                ({ data }) => {
                    if (data.length) {
                        this.setItems(data);
                    }
                }
            );
        },

        // Use data paste, get from clipboard
        onPaste(evt) {
            this.setItems(evt.clipboardData.getData('text/plain'));
        }
    }
};
