const webpackConfig = require('../../build/webpack.test.conf')
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function (config) {
  config.set({
    browsers: ['Chrome_no_sandbox'],
    customLaunchers: {
      Chrome_no_sandbox: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ]
      }
    },
    frameworks: ['mocha', 'sinon-chai','es6-shim'],
    plugins: [
 'karma-sourcemap-loader',
  'karma-webpack',
     'karma-babel-preprocessor',
'karma-mocha',
'karma-sinon-chai',
'karma-coverage',
'karma-spec-reporter',
'karma-chrome-launcher',
'karma-es6-shim'
    ],
babelPreprocessor: {
    options: {
        "presets": ["es2015"],
        "plugins": ["transform-es2015-modules-umd"]
    }
},
    reporters: ['spec', 'coverage'],
    files: [
      'specs/**/*.spec.js',
			'../../src/components/**/*.vue',
      'https://code.jquery.com/jquery-1.11.2.min.js'
    ],
    preprocessors: {
 '**/*.spec.js': ['webpack', 'sourcemap','babel'],
      './index.js': ['webpack', 'sourcemap','babel'],

    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    client: {
      captureConsole: false
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [{ type: 'lcov', subdir: '.' }, { type: 'text-summary' }]
    }
  })
}
