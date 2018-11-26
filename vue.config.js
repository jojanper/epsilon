const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
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
