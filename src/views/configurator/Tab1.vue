<template>
  <div>
    <draal-config-paths
      class="mb-10"
      title="File path configuration"
      reload-text="Reload files from specified path"
      v-model="configpath"
      :schema="schema"
      :tool-icon-attrs="toolIconAttrs"
      :file-query="fileQuery"
      :filter-options="filterOptions"
      @data-loaded="addMessage('Configuration data successfully loaded')"
    ></draal-config-paths>
  </div>
</template>

<script>
import { configuratorMixin } from './mixin';
import DraalConfigPaths from './ConfigPaths.vue';

import { FILE_OPEN_INPUT } from '@/components/core/form/input';

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

export default {
    name: 'DraalAppConfiguratorTab1',
    mixins: [configuratorMixin],
    components: {
        DraalConfigPaths
    },
    data() {
        const schema = SCHEMA;
        this.setSchemaCallbacks([schema]);

        return {
            configpath: '',
            schema,
            filterOptions: {
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
            }
        };
    }
};
</script>
