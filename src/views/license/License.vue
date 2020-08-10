<template>
  <div class="mt-3 mb-3">
    <draal-spinner :state="processing">
      <draal-tooltip
        position="top"
        :name="$t('licensePage.quickHelp')"
        classes="pl-3 ml-3 mb-3"
        icon="mdi-information-outline"
        @clicked="helpDialog=true"
      ></draal-tooltip>

      <div v-if="!product">
        <v-btn
          class="mr-2 mb-2"
          color="primary"
          @click="setProduct($t('licensePage.captureName'))"
        >{{ $t('licensePage.captureBtn') }}</v-btn>
        <v-btn
          class="mr-2 mb-2"
          color="primary"
          @click="setProduct($t('licensePage.playbackName'))"
        >{{ $t('licensePage.playbackBtn') }}</v-btn>
      </div>

      <!-- Select target branch and license target -->
      <draal-multi-stage-select
        v-if="product"
        :key="product"
        :configData="selectData"
        :listData="listData"
        :selectedData="selectedData"
        @selected="selected"
      ></draal-multi-stage-select>

      <div v-if="product">
        <!-- Show shell response data -->
        <draal-terminal :dataInput="terminalData"></draal-terminal>

        <v-btn
          class="mr-2 mb-2"
          :disabled="disableLicense"
          color="primary"
          @click="createLicense"
        >{{ licenseButtonText }}</v-btn>

        <v-btn
          class="mr-2 mb-2"
          :disabled="disableRelease"
          color="primary"
          @click="showDialog = true"
        >{{ releaseButtonText }}</v-btn>

        <v-btn class="mr-2 mb-2" color="error" @click="clear">{{ $t('licensePage.clearBtn') }}</v-btn>

        <!-- Download received license file locally -->
        <draal-tooltip
          v-if="license.url"
          position="bottom"
          :name="license.name"
          classes="d-block mt-3"
          :link="$t('licensePage.downloadLinkName')"
          :linkDownload="license.name"
          :linkUrl="license.url"
        ></draal-tooltip>
      </div>

      <!-- Release creation confirmation dialog -->
      <draal-dialog
        :model="showDialog"
        :title="$t('licensePage.confirmTitle')"
        :text="$t('licensePage.confirmText')"
        :okText="$t('licensePage.confirmRelease')"
        :cancelText="$t('licensePage.cancelRelease')"
        @close-dialog="cancelDialog"
        @cancel-dialog="cancelDialog"
        @ok-dialog="confirmDialog"
      ></draal-dialog>

      <!-- License help dialog -->
      <draal-dialog
        :model="helpDialog"
        :title="$t('licensePage.helpContentTitle')"
        maxWidth="750"
        @close-dialog="helpDialog = false"
      >
        <template v-slot:body>
          <v-card-text class="text-left" v-html="$t('licensePage.helpContent')"></v-card-text>
        </template>
      </draal-dialog>
    </draal-spinner>
  </div>
</template>

<script>
import AudioApi from '@/common/audio_api';
import { getContentDispositionFilename } from '@/common/utils';
import SelectInput from '@/components/form/inputs/SelectInput.vue';
import DraalSpinner from '../../components/utils/Spinner.vue';
import DraalDialog from '../../components/utils/Dialog.vue';
import DraalTooltip from '../../components/utils/Tooltip.vue';
import DraalTerminal from '../../components/terminal/Terminal.vue';
import { terminalMixin } from '../../components/terminal/terminalMixin';

import DraalMultiStageSelect from '../../components/MultiStageSelect.vue';

export default {
    components: {
        SelectInput,
        DraalSpinner,
        DraalDialog,
        DraalTooltip,
        DraalTerminal,
        DraalMultiStageSelect
    },
    mixins: [terminalMixin],
    data() {
        return {
            ingredients: ['onions', 'chicken', 'peas', 'carrot', 'berries'],
            product: null,

            disableLicense: true,
            disableRelease: true,

            license: {
                url: null,
                name: 'License' // Response is expected to specify actual name
            },

            showDialog: false,
            helpDialog: false,

            selectedData: [],
            listData: [[], []]
        };
    },
    computed: {
        licenseButtonText() {
            const key = `licensePage.${this.product}CreateLicenseBtn`;
            return this.$t(key);
        },

        releaseButtonText() {
            const key = `licensePage.${this.product}CreateReleaseBtn`;
            return this.$t(key);
        },

        selectData() {
            return [
                {
                    placeholder: this.$t('licensePage.branchPlaceHolder'),
                    label: this.$t('licensePage.branchLabel')
                },
                {
                    placeholder: this.$t('licensePage.targetPlaceHolder'),
                    label: this.$t('licensePage.targetLabel')
                }
            ];
        }
    },
    methods: {
        setProduct(product) {
            this.product = product;
            this.license.url = null;
        },

        setRemoteBranches(response) {
            response.data.forEach(item => this.listData[0].push(item));
            this.processing = false;
        },

        branchSelected() {
            this.disableLicense = true;
            this.disableRelease = true;
        },

        targetSelected() {
            this.disableLicense = false;
            this.disableRelease = false;
            this.clearTerminalData();
        },

        createRelease() {
            this.processing = true;
            this.disableRelease = true;
            this.clearTerminalData();

            const branch = this.selectedData[0];
            const target = this.selectedData[1];
            this.terminalExec(AudioApi.createRelease(this.product, branch, target));
        },

        createLicense() {
            this.processing = true;
            this.clearTerminalData();

            const branch = this.selectedData[0];
            const target = this.selectedData[1];
            const observable = AudioApi.createTarget(this.product, branch, target);
            observable.subscribe(this.renderOutputLicense, this.renderTerminalError);
        },

        renderOutputLicense(response) {
            this.processing = false;

            if (response.errors) {
                return this.renderErrorResponse(response, true);
            }

            this.license.url = URL.createObjectURL(response.data);

            const disposition = response.headers['content-disposition'];
            this.license.name = getContentDispositionFilename(disposition);

            return 0;
        },

        clear() {
            this.product = null;
            this.license.url = null;
            this.disableLicense = true;
            this.disableRelease = true;
            this.clearTerminalData();
            this.selectedData.splice(0, this.selectedData.length);
        },

        cancelDialog() {
            this.showDialog = false;
        },

        confirmDialog() {
            this.showDialog = false;
            this.createRelease();
        },

        selected(index, data) {
            this.selectedData[index] = data;
            this.clearTerminalData();

            if (index === 0) {
                // Target branch selected
                this.processing = true;

                // Load the available license targets for the specifid branch
                const observable = AudioApi.remoteTargets(this.product, this.selectedData[0]);
                observable.subscribe(response => {
                    this.processing = false;

                    // Prepare 2nd selection list data
                    this.selectedData[1] = undefined;
                    this.listData[1].splice(0, this.listData[1].length);
                    response.data.forEach(item => this.listData[1].push(item));

                    this.branchSelected();
                }, this.renderTerminalError);
            } else if (index === 1) {
                // License target selected
                this.targetSelected();
            }
        }
    }
};
</script>
