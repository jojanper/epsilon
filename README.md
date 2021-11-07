[![build][actions-image]][actions-url]
[![codecov.io][codecov-image]][codecov-url]
![dependabot status](https://img.shields.io/badge/dependabot-enabled-025e8c?logo=Dependabot)

[actions-image]: https://github.com/jojanper/epsilon/workflows/CI%20Build/badge.svg
[actions-url]: https://github.com/jojanper/epsilon/actions
[codecov-image]: https://codecov.io/gh/jojanper/epsilon/coverage.svg?branch=master
[codecov-url]: https://codecov.io/gh/jojanper/epsilon?branch=master

# epsilon

> Vue application playground. Project setup has been generated using [vue-cli 3](https://github.com/vuejs/vue-cli). Testing framework is [Jest](https://facebook.github.io/jest/). Unit tests are located in same folder as components.

Demo available [here](https://jojanper.github.io/epsilon/)

## Build Setup

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run serve

# Run static server that serves locales (app requests new locales on lazy loaded manner)
npm run dev-proxy

# Build for production with minification
npm run build

# Run unit tests
npm run test:unit

# Run e2e tests
npm run test:e2e
```

For a detailed explanation on how things work, check out the [guide](https://cli.vuejs.org/).

## Publish to GitHub Pages

``` bash
npm run gh-pages
```

## License

[MIT](/LICENSE)
