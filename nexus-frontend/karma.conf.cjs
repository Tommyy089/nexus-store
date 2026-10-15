const webpack = require('webpack');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/test/NexusApp.spec.jsx'
    ],
    preprocessors: {
      'src/test/NexusApp.spec.jsx': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fullySpecified: false
            }
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ],
                plugins: [
                  ['istanbul', { exclude: ['src/test/**'] }]
                ]
              }
            }
          }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify({ NODE_ENV: 'test' })
        })
      ],
      resolve: {
        extensions: ['.js', '.jsx', '.mjs']
      }
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
        { type: 'text' }
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};