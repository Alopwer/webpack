const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.config');

const devConfig = merge(baseConfig, {
    mode: 'development',
    output: {
        filename: 'js/[name].js',
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        port: 8082,
        contentBase: path.resolve(__dirname, '../dist'),
        overlay: true,
        openPage: 'html'
    }
})

module.exports = new Promise((res, rej) => {
    res(devConfig)
})