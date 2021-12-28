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
import DraalAppConfiguratorTab1 from './Tab1.vue';
import DraalAppConfiguratorTab2 from './Tab2.vue';
import DraalAppConfiguratorTab3 from './Tab3.vue';
import DraalAppConfiguratorTab4 from './Tab4.vue';
import DraalAppConfiguratorTab5 from './timeline/View.vue';

const VIEWS = [
    {
        title: 'Forms',
        children:
        [
            {
                title: 'Example form 1',
                component: DraalAppConfiguratorTab2
            },
            {
                title: 'Example form 2',
                component: DraalAppConfiguratorTab5
            }
        ]
    },
    {
        title: 'Utils',
        children: [
            {
                title: 'Config path',
                component: DraalAppConfiguratorTab1
            },
            {
                title: 'Icon dialog',
                component: DraalAppConfiguratorTab3
            },
            {
                title: 'File imports',
                component: DraalAppConfiguratorTab4
            }
        ]
    }
];

export default {
    name: 'DraalAppConfigurator',
    components: {
        DraalAppConfiguratorTab1,
        DraalAppConfiguratorTab2,
        DraalAppConfiguratorTab3,
        DraalAppConfiguratorTab4,
        DraalAppConfiguratorTab5
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
