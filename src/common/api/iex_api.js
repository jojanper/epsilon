import Network from '../network';

const TOKEN = process.env.VUE_APP_IEXAPI_TOKEN;

class IEXApi {
    constructor(network) {
        this.rootUrl = 'https://cloud.iexapis.com/stable';
        this.network = network;
    }

    stock(symbolId) {
        const url = `${this.rootUrl}/stock/${symbolId}/batch?types=quote,news,chart&range=1m&last=50&token=${TOKEN}`;
        return this.network.get(url);
    }
}

const service = new IEXApi(Network);

export default service;
