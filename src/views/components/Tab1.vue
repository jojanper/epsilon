<template>
  <div>
    <div class="text-left mb-4 text-lg-subtitle-1">
      Filter data from remote based on selected file path. User types path prefix, autocomplete
      functionality offers available filesystem paths and user selects the path to use. Data from
      path is loaded when user clicks the reload icon.
    </div>
    <draal-config-path
      class="mb-10"
      title="File path configuration"
      reload-text="Reload files from specified path"
      v-model="configpath"
      :schema="schema"
      :tool-icon-attrs="toolIconAttrs"
      :file-query="fileQuery"
      :filter-options="filterOptions"
      @data-loaded="configDataLoaded"
    ></draal-config-path>

    Loaded config data
    <pre>{{ configData }}</pre>
  </div>
</template>

<script>
import { configuratorMixin } from './mixin';

import { appComputed, appActions } from '@/store/helpers';
import { FILE_OPEN_INPUT } from '@/components/core/form/input';
import DraalConfigPath from '@/components/app/ConfigPath.vue';

const SCHEMA = {
    type: FILE_OPEN_INPUT,
    mode: 'filesystem',
    fileCache: false,
    placeholder: 'Enter base path',
    label: 'Base path for configuration files search',
    name: 'configpath',
    debounce: 50,
    clearable: true,
    fileOptions: {
        onlydir: true,
        nodotdir: true
    },
    help: {
        tooltip: 'What is this',
        title: 'Base path for configuration files',
        body: 'Binary used for execution.'
    }
};

const FILTEROPTIONS = {
    params: {
        recursive: true,
        base: 'audioencapp'
    },
    ext: [
        {
            key: 'bin'
        },
        {
            ext: '.wav',
            key: 'inputWav'
        },
        {
            ext: '.license',
            key: 'license'
        }
    ]
};

const KEYS = FILTEROPTIONS.ext.map(item => item.key);

export default {
    name: 'DraalAppConfiguratorTab1',
    mixins: [configuratorMixin],
    components: {
        DraalConfigPath
    },
    data() {
        const schema = SCHEMA;
        this.setSchemaCallbacks([schema]);

        return {
            configpath: '',
            schema,
            filterOptions: FILTEROPTIONS
        };
    },
    computed: {
        getConfigFiles: appComputed.getConfigFiles,

        configData() {
            const data = {};

            KEYS.forEach(key => {
                data[key] = this.getConfigFiles(key);
            });

            return data;
        }
    },
    methods: {
        setConfigFiles: appActions.setConfigFiles,

        configDataLoaded(data) {
            // Add results to store
            this.setConfigFiles(data);

            this.addMessage('Configuration data successfully loaded');
        }
    }
};
</script>
