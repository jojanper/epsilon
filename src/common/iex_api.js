import Network from './network';


class IEXApi {
    constructor(network) {
        this.rootUrl = 'https://api.iextrading.com/1.0/';
        this.network = network;
    }

    stock(symbolId) {
        const url = `${this.rootUrl}/stock/${symbolId}/batch?types=quote,news,chart&range=1m&last=1`;
        return this.network.get(url);
    }
}

const service = new IEXApi(Network);

export default service;
