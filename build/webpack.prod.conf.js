const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const prodConfig = merge(baseConfig, {
    mode: 'production',
    optimization: {
        ...baseConfig.optimization,
        minimize: true,
        minimizer: [
            new OptimizeCssAssetsPlugin(),
            new UglifyJsPlugin({
                test: /\.js($|\?)/i
            })
        ]
    }
})

module.exports = new Promise((res, rej) => {
    res(prodConfig)
})