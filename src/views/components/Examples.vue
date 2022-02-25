<template>
  <div>
    <h1>{{ $t('configuratorPage.title') }}</h1>

    <v-tabs
      vertical
      :value="activeTab"
      @change="tabChanged"
    >
      <v-tab
        v-for="(data, index) in views"
        :key="index"
      >
        {{ data.title }}
      </v-tab>

      <v-tab-item
        v-for="(data, index) in views"
        :key="index"
      >
        <v-tabs
          v-model="activeChildTab[index]"
          @change="data => childTabChanged(index, data)"
        >
          <v-tab
            v-for="(data2, index2) in data.children"
            :key="index2"
          >
            {{ data2.title }}
          </v-tab>

          <v-tab-item
            v-for="(data2, index2) in data.children"
            :key="index2"
          >
            <v-card flat>
              <v-card-text>
                <component :is="data2.component"></component>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import DraalExampleConfigPath from './ConfigPathExample.vue';
import DraalExampleForm1 from './FormExample1.vue';
import DraalExampleIconDialog from './IconDialogExample.vue';
import DraalExampleFileImport from './FileImportExample.vue';
import DraalExampleFormTimeline from './timeline/View.vue';
import DraalExampleAlerts from './AlertExample.vue';
import DraalExampleMediaProperties from './MediaProperties.vue';
import DraalExampleNested from './NestedExample.vue';

const VIEWS = [
    {
        title: 'Forms',
        children:
        [
            {
                title: 'Example form 1',
                component: DraalExampleForm1
            },
            {
                title: 'Example form 2',
                component: DraalExampleFormTimeline
            }
        ]
    },
    {
        title: 'Utils',
        children: [
            {
                title: 'Config path',
                component: DraalExampleConfigPath
            },
            {
                title: 'Icon dialog',
                component: DraalExampleIconDialog
            },
            {
                title: 'File imports',
                component: DraalExampleFileImport
            },
            {
                title: 'Alerts & Notifications',
                component: DraalExampleAlerts
            },
            {
                title: 'Media file properties',
                component: DraalExampleMediaProperties
            },
            {
                title: 'Nested data',
                component: DraalExampleNested
            }
        ]
    }
];

export default {
    name: 'DraalAppConfigurator',
    components: {
        DraalExampleConfigPath,
        DraalExampleForm1,
        DraalExampleIconDialog,
        DraalExampleFileImport,
        DraalExampleFormTimeline,
        DraalExampleAlerts,
        DraalExampleMediaProperties,
        DraalExampleNested
    },
    props: {
        vtab: {
            type: Number,
            required: false,
            default: null
        },
        htab: {
            type: Number,
            required: false,
            default: null
        }
    },
    data() {
        const vtab = this.vtab || 0;
        const activeTab = vtab < VIEWS.length ? vtab : 0;

        const htab = this.htab || 0;
        const activeChildTab = Array(VIEWS.length).fill(0);
        if (vtab < VIEWS.length && htab < VIEWS[activeTab].children.length) {
            activeChildTab[activeTab] = htab;
        }

        if (this.vtab == null || this.htab == null) {
            this.updateRouterQuery(activeTab, activeChildTab[activeTab]);
        }

        return {
            views: VIEWS,
            activeTab,
            activeChildTab
        };
    },
    methods: {
        tabChanged(tab) {
            this.activeTab = tab;
            for (let i = 0; i < this.activeChildTab.length; i++) {
                this.activeChildTab[i] = 0;
            }

            this.updateRouterQuery(this.activeTab, 0);
        },

        childTabChanged(index, tab) {
            this.activeChildTab[index] = tab;
            this.updateRouterQuery(this.activeTab, this.activeChildTab[index]);
        },

        updateRouterQuery(vtab, htab) {
            this.$router.replace({ query: { vtab, htab } });
        }
    }
};
</script>
