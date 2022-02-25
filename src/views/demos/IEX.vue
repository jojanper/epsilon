<template>
  <div
    class="p-3 elevation-3"
    v-if="data.length"
  >
    <div class="row text-left">
      <div class="col-sm">{{ quote.companyName }} ({{ quote.symbol }})</div>
      <div class="col-sm">Close: {{ chart[chart.length - 1].close }}</div>
      <div class="col-sm">High: {{ chart[chart.length - 1].high }}</div>
      <div class="col-sm">Low: {{ chart[chart.length - 1].low }}</div>
    </div>

    <div class="pb-3">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </div>

    <draal-data-table
      :search="search"
      :data="data"
      :headers="headers"
      :customColumns="['datetime','headline']"
      expand="More..."
      :tableAttributes="{'item-key': 'index', ':search': search}"
      :actions="['edit', 'delete']"
      :actionsConfig="{name: 'Actions', width: '15%'}"
    >
      <template v-slot:table.datetime="{ data }">
        <div v-html="getTime(data.datetime)"></div>
      </template>
      <template v-slot:table.headline="{ data }">
        <a
          :href="data.url"
          target="_blank"
        >{{ data.headline }}</a>
      </template>
      <template v-slot:table.expand="{ data }">
        <div class="row mt-1 mb-1">
          <div class="hidden-sm-and-down">
            <img
              class="p-3"
              :src="data.image"
              width="150"
              height="150"
              alt="Image"
            />
          </div>
          <div class="col text-left">{{ data.summary }}</div>
        </div>
      </template>
    </draal-data-table>
  </div>
</template>

<script>
import { IEXApi } from '@/common/api';
import DraalDataTable from '@/components/core/DataTable.vue';

function dummyErrorHandler() {}

export default {
    name: 'DraalAppIEX',
    components: {
        DraalDataTable
    },

    created() {
        IEXApi.stock('aapl').subscribe(data => {
            this.quote = { ...data.quote };
            data.chart.forEach(chart => this.chart.push(chart));
            data.news.forEach((news, index) => this.data.push({ ...news, index }));
        }, dummyErrorHandler);
    },

    data() {
        return {
            data: [],
            chart: [],
            quote: {},

            search: '',
            headers: [
                {
                    text: 'Source',
                    align: 'left',
                    filterable: true,
                    sortable: true,
                    value: 'source',
                    width: '20%'
                },
                {
                    text: 'Summary',
                    align: 'left',
                    filterable: true,
                    sortable: true,
                    value: 'headline',
                    width: '50%'
                },
                {
                    text: 'Date',
                    align: 'left',
                    filterable: true,
                    sortable: true,
                    value: 'datetime',
                    width: '15%'
                }
            ]
        };
    },
    methods: {
        getTime(ts) {
            return new Date(ts).toDateString();
        }
    }
};
</script>
