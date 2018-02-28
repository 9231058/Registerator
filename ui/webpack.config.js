/*
 * +===============================================
 * | Author:        Parham Alvani <parham.alvani@gmail.com>
 * |
 * | Creation Date: 31-12-2017
 * |
 * | File Name:     webpack.config.js
 * +===============================================
 */
const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

function getEntrySources (sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-hot-middleware/client')
  }

  return sources
}

const basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    __PRODUCTION__: process.env.NODE_ENV === 'production',
    // This makes it possible for us to safely use env vars on our code
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    inject: 'body'
  })
]

const devPlugins = [
  new webpack.NoEmitOnErrorsPlugin()
]

const prodPlugins = []

const plugins = basePlugins
  .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? devPlugins : [])

module.exports = {
  entry: {
    app: getEntrySources(['./src/index.js']),
    vendor: [
      'es5-shim',
      'es6-shim',
      'es6-promise',
      'react'
    ]
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/assets/',
    chunkFilename: '[id].chunk.js'
  },
  plugins: plugins,

  devServer: {
    historyApiFallback: { index: '/' },
    disableHostCheck: true
  },

  module: {
    rules: [
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      { enforce: 'pre', test: /\.js$/, loader: 'eslint-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(js|jsx)$/, loaders: ['react-hot-loader', 'babel-loader'], exclude: /node_modules/ },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'url-loader?prefix=img/&limit=5000' },
      { test: /\.(woff|woff2|ttf|eot)$/, loader: 'url-loader?prefix=font/&limit=5000' }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  }
}
