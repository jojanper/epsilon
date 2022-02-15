<template>
  <div class="mt-3 mb-3">
    <draal-spinner :state="processing">
      <!-- Select dog breed and possibly sub-breed -->
      <draal-multi-stage-select
        :configData="selectData"
        :listData="listData"
        :selectedData="selectedData"
        @selected="selected"
      ></draal-multi-stage-select>

      <div>
        <v-carousel
          class="mx-auto"
          :style=style
          v-if="images.length"
          :hide-delimiters="images.length > 10 ? true : false"
        >
          <v-carousel-item
            v-for="(img,i) in images"
            :key="i"
            :src="img"
            :style=style
            reverse-transition="fade-transition"
            transition="fade-transition"
          ></v-carousel-item>
        </v-carousel>
      </div>
    </draal-spinner>
  </div>
</template>

<script>
import DraalSpinner from '@/components/core/utils/Spinner.vue';
import DraalMultiStageSelect from '@/components/core/MultiStageSelect.vue';
import { DogApi } from '@/common/api';

export default {
    name: 'DraalAppDogs',
    components: {
        DraalSpinner,
        DraalMultiStageSelect
    },
    data() {
        return {
            images: [],
            helpDialog: false,
            processing: false,
            selectedData: [],
            listData: [[], []],
            style: 'width: 800px !important'
        };
    },
    computed: {
        selectData() {
            return [
                {
                    placeholder: this.$t('dogApiPage.breedPlaceHolder'),
                    label: this.$t('dogApiPage.breedLabel'),
                    outlined: true,
                    help: {
                        title: this.$t('dogApiPage.quickHelp'),
                        body: this.$t('dogApiPage.helpContent')
                    }
                },
                {
                    placeholder: this.$t('dogApiPage.subBreedPlaceHolder'),
                    label: this.$t('dogApiPage.subBreedLabel'),
                    outlined: true
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

                // Clear previous data
                this.selectedData[1] = data;
                this.listData[1].splice(0, this.listData[1].length);

                if (this.breeds[data].length) {
                    // Select new sub-breeds
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
