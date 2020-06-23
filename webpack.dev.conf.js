'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const smp = new SpeedMeasurePlugin();

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(
    baseWebpackConfig.entry[name]
  );
});

module.exports = merge(baseWebpackConfig, {
  // smp.wrap(
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
  },
  // cheap-module-eval-source-map is faster for development
  // devtool: "cheap-module-eval-source-map",
  devtool: 'eval',
  // output: {
  //   filename: '[name].[hash].js',
  //   devtoolModuleFilenameTemplate: info => {
  //     const isJsFile = info.resourcePath.match(/^\.\/src\/.*\.js$/)
  //     return `webpack:///${isJsFile ? info.resourcePath.replace('./', '') : info.resourcePath}`
  //   }
  // },

  output: {
    devtoolModuleFilenameTemplate(info) {
      return 'file:///' + encodeURI(info.absoluteResourcePath);
    },
    devtoolFallbackModuleFilenameTemplate(info) {
      return (
        'file:///' + encodeURI(info.absoluteResourcePath) + '?' + info.hash
      );
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    // new UglifyJsPlugin({
    //   parallel: true
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
    new FriendlyErrorsPlugin(),
  ],
});
//);
