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
            entry: !isElectron() ? 'src/main.js' : 'src/mainElectron.js',
            chunks: ['chunk-common', 'chunk-vendors', 'chunk-vendor-vuetify', 'index']
        }
    },

    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin({
                patterns:
                    [{ from: 'src/locales', to: 'locales' }]
            })
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    // Vuetify into chunk of its own
                    vendorVuetify: {
                        test: /[\\/]node_modules[\\/](vuetify)[\\/]/,
                        name: 'chunk-vendor-vuetify',
                        priority: 0,
                        chunks: 'all'
                    },
                    // All other node_modules dependencies into vendor chunk
                    // See https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/config/app.js
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        chunks: 'initial'
                    },
                    common: {
                        name: 'chunk-common',
                        minChunks: 2,
                        priority: -20,
                        chunks: 'initial',
                        reuseExistingChunk: true
                    }
                }
            }
        }
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
                target: 'http://localhost:3000'
            },
            '/api': {
                target: 'http://localhost:3000'
            }
        }
    }
};
