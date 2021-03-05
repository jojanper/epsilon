<template>
  <div class="form-input file-query-input-wrapper">
    <div class="file-query-input">
      <ValidationObserver ref="observer">
        <div class="row m-0 first-row">
          <div class="col-sm p-0">
            <ValidationProvider
              ref="provider"
              v-slot="{ errors }"
              :name="name"
              :rules="inputRules"
            >
              <v-text-field
                v-if="mode === RENDER_MODES.file"
                :class="outlined ? 'file-input outlined' : ' file-input no-outlined'"
                v-model="fieldValue"
                :error-messages="errors"
                :label="label"
                :placeholder="placeholder"
                @click="fileDialog=true"
                :readonly="true"
                v-bind="inputAttrs"
                @dragenter="setDragging(true)"
                @dragend="setDragging(false)"
                @dragleave="setDragging(false)"
                @dragover.prevent
                @drop="drop"
                :loading="loading"
              >
                <v-progress-linear
                  v-if="dragging"
                  slot="progress"
                  :value="100"
                  :color="draggingColor"
                  absolute
                  height="5"
                ></v-progress-linear>

                <input-help
                  v-if="help"
                  slot="append-outer"
                  @form-input-help="inputHelpEvent"
                ></input-help>
                <draal-file-drop
                  @fileDrop="onDrop"
                  slot="append"
                  :title="dropTitle || $t('form.remoteInputDropTitle')"
                ></draal-file-drop>
              </v-text-field>

              <v-text-field
                v-if="mode === RENDER_MODES.text"
                :class="outlined ? 'outlined' : 'no-outlined'"
                v-model="fieldValue"
                :error-messages="errors"
                :label="label"
                :placeholder="placeholder"
                v-bind="inputAttrs"
                @input="changeEvent"
              >
                <input-help
                  v-if="help"
                  slot="append-outer"
                  @form-input-help="inputHelpEvent"
                ></input-help>
              </v-text-field>

              <v-autocomplete
                v-if="mode === RENDER_MODES.filesystem"
                :class="outlined ? 'outlined' : 'no-outlined'"
                v-model="fieldValue"
                :error-messages="loading ? [$t('form.fileInfoQuery')] : errors"
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
          </div>
        </div>

        <div
          :class="secondRowCls"
          v-if="fieldValue"
        >
          <div class="col-sm pb-0">
            <ValidationProvider
              name="selected"
              v-if="listData.length"
            >
              <select-input
                classes=" "
                :placeholder="selectPlaceholder"
                :value="selectedData"
                :data="listData"
                name="select-list"
                :label="selectLabel"
                :data-key="dataKey"
                @input="setSelectedData"
                rules="required"
                :autocomplete="true"
                v-bind="inputAttrs"
              ></select-input>
            </ValidationProvider>
          </div>

          <div class="col-sm pb-0">
            <ValidationProvider
              name="custom"
              v-if="customId"
              v-slot="{ errors }"
              rules="required"
            >
              <v-text-field
                v-model="customValue"
                :label="customLabel"
                :error-messages="errors"
                :placeholder="customPlaceholder"
                @input="setCustomValue"
                v-bind="inputAttrs"
              ></v-text-field>
            </ValidationProvider>
          </div>
        </div>

        <div :class="spinnerRowCls">
          <draal-spinner
            :state="processing"
            width="40"
            height="40"
            type="spinner-3"
            :class="['float-left ml-1', outlined ? 'outlined' : 'no-outlined']"
          ></draal-spinner>
        </div>

        <!-- File dialog is also hidden -->
        <draal-file-dialog
          v-model="fileDialog"
          @file-select="onDrop"
        ></draal-file-dialog>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate';

import { dataKey, dropTitle, dataQuery } from './options';
import { fileListingMixin, RENDER_MODES } from './fileListingMixin';
import BaseInput from './BaseInput.vue';
import SelectInput from './SelectInput.vue';

import { debounce } from '@/common/utils';
import DraalFileDrop from '@/components/core/utils/FileDrop.vue';
import DraalFileDialog from '@/components/core/utils/FileDialog.vue';
import DraalSpinner from '@/components/core/utils/Spinner.vue';

/**
 * Data query assisted select input. Component data flow is as follows:
 *
 * - User opens file dialog by clicking the input or by dragging and dropping
 *   the file to the icon that is appended to the input
 * - The file object is passed to the data query function which is given as prop
 * - The called function will return array data which is populated to the selection input
 * - Once data is selected from the selection input, a check is made to see if the data
 *   is actually requesting manual input.
 * - Manual input becomes visible if 'custom' property of the selected data object is
 *   set to true
 * - Once data is selected or manually entered, an event is send to parent
 *
 * @displayName FileQueryInput
 */
export default {
    name: 'FileQueryInput',
    extends: BaseInput,
    mixins: [fileListingMixin],
    components: {
        ValidationObserver,
        SelectInput,
        DraalFileDrop,
        DraalFileDialog,
        DraalSpinner
    },
    props: {
        dataKey,
        dropTitle,
        dataQuery,
        /**
         * Data field from selected object used to indicate data changes.
         */
        selectKey: {
            type: String,
            required: false,
            default: null
        },
        /**
         * Placeholder text for select list.
         */
        selectPlaceholder: {
            type: String,
            required: true
        },
        /**
         * Label for select list.
         */
        selectLabel: {
            type: String,
            required: true
        },
        /**
         * Placeholder text for custom text input.
         */
        customPlaceholder: {
            type: String,
            required: true
        },
        /**
         * Label for custom text input.
         */
        customLabel: {
            type: String,
            required: true
        },
        /**
         * Validation rule for the query input.
         */
        queryRule: {
            type: String,
            required: false,
            default: null
        }
    },
    data() {
        const rules = this.rules || '';
        const inputRules = `${rules}|${this.queryRule}:@selected,@custom`;

        const fieldValue = this.value ? this.value.file : null;
        const listData = this.value ? this.value.listData : [];
        const selectedData = this.value ? this.value.selected : null;
        const customValue = this.value ? this.value.custom : null;
        const customId = customValue;

        this.changeEvent = debounce(this.getFileInfo, 400);

        return {
            fieldValue,
            fileDialog: false,

            inputRules,

            listData,
            selectedData,

            customId,
            customValue,

            processing: false
        };
    },
    computed: {
        secondRowCls() {
            const cls = ['row second-row'];

            if (!this.fieldValue) {
                cls.push('d-none');
            }

            if (this.outlined) {
                cls.push('outlined');
            } else {
                cls.push('no-outlined');
            }

            return cls.join(' ');
        },

        spinnerRowCls() {
            const cls = ['row spinner-wrapper'];

            if (!this.processing) {
                cls.push('d-none');
            }

            return cls.join(' ');
        }
    },
    methods: {
        // User typed file path to input
        getFileInfo(value) {
            if (this.mode === RENDER_MODES.filesystem && this.fileExt && !this.validExtension(value)) {
                return;
            }

            this.onDrop([{ path: value }]);
        },

        // User selected file (either using file dialog or file was dropped)
        onDrop(files) {
            if (files.length) {
                const file = files[0];

                this.customId = false;
                this.processing = true;
                this.fileDialog = false;
                this.fieldValue = file.path || file.name;
                this.listData.splice(0, this.listData.length);

                this.selectedData = null;
                this.customValue = null;
                this.customId = false;
                this.validateInput();

                // Get the list data
                this.dataQuery(file).subscribe(data => {
                    this.processing = false;
                    data.forEach(element => this.listData.push(element));
                    this.validateInput();
                }, err => {
                    this.processing = false;
                    this.sendInputEvent();
                    this.validateInput();

                    const error = {};
                    error[this.name] = err;

                    // Show the error after input validation cycle has stabilized
                    setTimeout(() => this.$refs.observer.setErrors(error), 100);
                });
            }
        },

        // Item selected from list
        setSelectedData(data) {
            this.customValue = null;
            this.selectedData = data;
            this.validateInput();

            if (data && data.custom === true) {
                this.customId = true;
            } else {
                this.customId = false;
                this.sendInputEvent();
            }
        },

        // User manually entered the value
        setCustomValue(value) {
            this.customValue = value;
            this.sendInputEvent();
            this.validateInput();
        },

        // Input event is emitted
        sendInputEvent() {
            const value = this.customValue || (this.selectedData ? this.selectedData[this.selectKey] : null);
            const data = {
                file: this.fieldValue,
                listData: this.listData,
                selected: this.selectedData,
                custom: this.customValue,
                value
            };

            /**
             * Send selected input data.
             */
            this.inputChangeEvent(data);
        }
    }
};
</script>
