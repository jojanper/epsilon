<template>
  <div>
    <h1>{{ $t('configuratorPage.title') }}</h1>

    <v-tabs vertical>
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
        <v-tabs>
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
import DraalAppConfiguratorTab5 from './Tab5.vue';

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
    data() {
        return {
            views: VIEWS
        };
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
a {
    color: #42b983;
}
</style>
