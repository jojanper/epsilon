<template>
  <div>
    <div class="text-left mb-4 text-lg-subtitle-1">
      File import alternatives
    </div>
    <div class="row elevation-3 mb-4 rounded mt-1">
      <draal-file-import
        class="
      col-sm"
        tooltip-text="Import JSON"
        tooltip-position="right"
        icon-color="red darken-2"
        icon="mdi-import"
        @file-select="fileSelect"
        :multiple="true"
        drag-class="text-underline"
        icon-size="large"
        icon-size-drag="large"
      >
      </draal-file-import>

      <draal-file-import
        tooltip-text="Open"
        class="col-sm"
        icon-color="blue"
        icon="mdi-folder-open"
        @file-select="fileSelect"
      ></draal-file-import>

      <draal-file-import
        tooltip-text="Open multiple files"
        class="col-sm"
        icon-color="blue"
        icon="mdi-plus"
        :drag="false"
        :multiple="true"
        @file-select="fileSelect"
      ></draal-file-import>

      <a
        class="col-sm"
        :href="linkUrl"
        :download="linkDownload"
      >
        <v-btn>Paina tästä</v-btn>
        <!--v-icon>mdi-export</v-icon-->
      </a>
    </div>
  </div>
</template>

<script>
import DraalFileImport from '@/components/core/utils/FileImport.vue';

export default {
    name: 'DraalAppConfiguratorTab4',
    components: {
        DraalFileImport
    },
    data() {
        const json = { a: 'foo', b: [1, 2, 3] };
        const blob = new Blob([JSON.stringify(json, null, 4)], { type: 'application/json' });
        const linkUrl = URL.createObjectURL(blob);
        const linkDownload = 'test.json';

        return {
            linkUrl,
            linkDownload
        };
    },
    methods: {
        fileSelect(files) {
            /* eslint-disable-next-line */
            console.log('selected', files[0]);
        }
    }
};
</script>
