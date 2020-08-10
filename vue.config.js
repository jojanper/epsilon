/* eslint-disable import/no-extraneous-dependencies */
const CopyWebpackPlugin = require('copy-webpack-plugin');

function isElectron() {
    return process.env.VUE_APP_IS_ELECTRON === 'true';
}

module.exports = {
    publicPath: process.env.PUBLIC_PATH || '/',
    productionSourceMap: process.env.NODE_ENV !== 'production',

    pages: {
        index: {
            entry: !isElectron() ? 'src/main.js' : 'src/mainElectron.js'
        }
    },

    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                { from: 'src/locales', to: 'locales' }
            ])
        ]
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        }
    },
    devServer: {
        proxy: {
            '/locales': {
                target: 'http://localhost:8090'
            }
        }
    }
};
