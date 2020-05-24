const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.s(a|c)ss$/,
                loader: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => ([
                                require('autoprefixer'),
                                require('cssnano')
                            ])
                        }
                    },
                    'sass-loader'
                ]
            }
        ],
    },
    plugins: [
        new ImageminPlugin({
            plugins: [
                imageminPngquant({
                    speed: 1,
                    quality: [0.5, 0.5],
                }),
                imageminMozjpeg({
                    quality: [0.5, 0.5]
                })
            ]
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        }),
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin({
            exclude: /node_modules/,
            extractComments: true
        })],
    },
}