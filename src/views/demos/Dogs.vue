<template>
  <div class="mt-3 mb-3">
    <draal-spinner :state="processing">
      <draal-tooltip
        position="top"
        :name="$t('dogApiPage.quickHelp')"
        classes="pl-3 ml-3 mb-3"
        icon="mdi-information-outline"
        @clicked="helpDialog=true"
      ></draal-tooltip>

      <!-- Select dog breed and possibly sub-breed -->
      <draal-multi-stage-select
        :configData="selectData"
        :listData="listData"
        :selectedData="selectedData"
        @selected="selected"
      ></draal-multi-stage-select>

      <v-carousel class="w-50 ml-auto mr-auto" v-if="images.length">
        <v-carousel-item
          v-for="(img,i) in images"
          :key="i"
          :src="img"
          class="ml-auto mr-auto"
          style="width: 650px; height: auto;"
          reverse-transition="fade-transition"
          transition="fade-transition"
        ></v-carousel-item>
      </v-carousel>

      <!-- Help dialog -->
      <draal-dialog
        :model="helpDialog"
        :title="$t('dogApiPage.helpContentTitle')"
        maxWidth="350"
        @close-dialog="helpDialog = false"
      >
        <template v-slot:body>
          <v-card-text class="text-left" v-html="$t('dogApiPage.helpContent')"></v-card-text>
        </template>
      </draal-dialog>
    </draal-spinner>
  </div>
</template>

<script>
import { DogApi } from '@/common/api';
import DraalSpinner from '../../components/utils/Spinner.vue';
import DraalDialog from '../../components/utils/Dialog.vue';
import DraalTooltip from '../../components/utils/Tooltip.vue';
import DraalMultiStageSelect from '../../components/MultiStageSelect.vue';

export default {
    components: {
        DraalSpinner,
        DraalDialog,
        DraalTooltip,
        DraalMultiStageSelect
    },
    data() {
        return {
            images: [],
            helpDialog: false,
            processing: false,
            selectedData: [],
            listData: [[], []]
        };
    },
    computed: {
        selectData() {
            return [
                {
                    placeholder: this.$t('dogApiPage.breedPlaceHolder'),
                    label: this.$t('dogApiPage.breedLabel')
                },
                {
                    placeholder: this.$t('dogApiPage.subBreedPlaceHolder'),
                    label: this.$t('dogApiPage.subBreedLabel')
                }
            ];
        }
    },
    mounted() {
        this.breeds = [];

        // Get the dog breeds
        DogApi.getBreeds().subscribe(data => {
            this.breeds = data.message;
            Object.keys(this.breeds).forEach(breed => this.listData[0].push(breed));

            // Select breed to available in query parameters
            if (this.$route.query.breed) {
                this.selected(0, this.$route.query.breed);
                this.$router.replace({ query: {} });
            }
        });
    },
    methods: {
        getImages(params) {
            DogApi.getBreed(...params).subscribe(({ message }) => {
                message.forEach(img => this.images.push(img));
                this.processing = false;
            });
        },

        selected(index, data) {
            this.selectedData[index] = data;
            this.images.splice(0, this.images.length);

            if (index === 0) {
                this.processing = true;
                if (this.breeds[data].length) {
                    // Clear previous sub-breeds and select new sub-breeds
                    this.listData[1].splice(0, this.listData[1].length);
                    this.breeds[data].forEach(subBreed => this.listData[1].push(subBreed));
                    this.processing = false;
                } else {
                    // No sub-breeds available, get the breed images
                    this.getImages([data]);
                }
            } else if (index === 1) {
                // Get the sub-breed images
                this.getImages(this.selectedData);
            }
        }
    }
};
</script>
