const webpackMerge = require('webpack-merge');
 
const commonConfig = require('./webpack.config.base.js');
 
module.exports = ({ env }) => {
  const envConfig = require(`./webpack.config.${env}.js`);
 
  return webpackMerge(commonConfig, envConfig);
};