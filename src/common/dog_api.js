import Network from './network';

class DogApi {
    constructor(network) {
        this.rootUrl = 'https://dog.ceo/api';
        this.network = network;
    }

    getBreeds() {
        const url = `${this.rootUrl}/breeds/list/all`;
        return this.network.get(url);
    }

    getBreed(breed, subBreed) {
        const base = `${this.rootUrl}/breed/${breed}`;
        const url = !subBreed ? `${base}/images` : `${base}/${subBreed}/images`;
        return this.network.get(url);
    }
}

const service = new DogApi(Network);

export default service;
