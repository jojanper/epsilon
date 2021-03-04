<template>
  <ValidationObserver>
    <ValidationProvider
      ref="provider"
      v-slot="{ errors }"
      :name="name"
      :rules="inputRules"
    >
      <v-autocomplete
        :class="classes"
        v-model="fieldValue"
        :error-messages="loading ? [$t('form.audioInfoQuery')] : errors"
        :items="items"
        :search-input.sync="search"
        :label="label"
        :placeholder="placeholder"
        @input="changeEvent"
        @paste="onPaste"
        v-bind="inputAttrs"
        :loading="loading"
        flat
        hide-no-data
        cache-items
      >
        <input-help
          v-if="help"
          slot="append-outer"
          @form-input-help="inputHelpEvent"
        ></input-help>
      </v-autocomplete>
    </ValidationProvider>

    <!-- Media file duration is available in hidden input -->
    <ValidationProvider
      name="duration"
      class="d-none"
    >
      <v-text-field v-model="mediaDuration"></v-text-field>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script>
import { fileInputMixin } from './fileInputMixin';
import { dataQuery } from './options';

import { debounce } from '@/common/utils';
import { rules } from '@/components/core/form/rules';

/**
 * Audio file with backend validation.
 *
 * @displayName LocalAudioFileInput
 */
export default {
    name: 'LocalAudioFileInput',
    mixins: [fileInputMixin],
    props: {
        dataQuery,
        // Remote file query function. Must return observable.
        fileQueryFn: {
            type: Function,
            required: true
        },
        // File extension used to query the file listing from remote.
        fileExt: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            items: [],
            search: null
        };
    },
    created() {
        // Debounce change events to reduce backend calls and smooth the UI behaviour
        this.changeEvent = debounce(this.getAudioInfo, 100);
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
        remoteQuery(v) {
            // If file selected and valid no need to query anything anymore
            if (this.fieldValue && rules.wavext.validate(this.fieldValue)) {
                return;
            }

            this.enableLoading(true);

            // Get file listing
            this.fileQueryFn(v, this.fileExt).subscribe(
                ({ data }) => {
                    if (data.length) {
                        this.items = data;
                    }

                    this.disableLoading();
                }
            );
        },

        // Get file details if input is valid
        getAudioInfo(value) {
            this.disableLoading();
            this.mediaDuration = 0;

            // Make sure file extension matches the expected
            if (value && rules.wavext.validate(value)) {
                this.fieldValueInt = value;
                this.enableLoading(true);

                // Query the audio details
                this.dataQuery(value).subscribe(({ data }) => {
                    this.disableLoading();
                    if (data.duration) {
                        // Audio file seems valid
                        this.setMediaDuration({ duration: data.duration });
                    } else {
                        // No duration available, file is not valid
                        this.setMediaError();
                    }
                });
            }
        },

        // Use paste data, get from clipboard
        onPaste(evt) {
            this.items = [evt.clipboardData.getData('text/plain')];
        }
    }
};
</script>
