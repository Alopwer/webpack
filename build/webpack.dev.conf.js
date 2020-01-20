const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.config');

const devConfig = merge(baseConfig, {
    mode: 'development',
    output: {
        filename: '[name].js',
        publicPath: '/'
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        port: 8082,
        contentBase: path.resolve(__dirname, '../dist/html'),
        overlay: true
    }
})

module.exports = new Promise((res, rej) => {
    res(devConfig)
})