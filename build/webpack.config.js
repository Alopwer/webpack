const path = require('path');
const glob = require('glob')
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const PATHS = {
    src: path.resolve(__dirname, '../src')
}

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
      const parts = item.split('.');
      const name = parts[0];
      const extension = parts[1];
    return new HTMLWebpackPlugin({
        filename: `html/${name}.html`,
        template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        minify: {
            collapseWhitespace: process.env.NODE_ENV === 'production'
        }
    })
    })
}
const htmlPlugins = generateHtmlPlugins('../src/html')

function generatePlugins() {
    return [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename : process.env.NODE_ENV === 'production' ? 'styles/[name].[contenthash].css' : 'styles/[name].css'
        }),
        new PurgecssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
            only: ['bundle']
        }),
        new CopyWebpackPlugin([
            {
                from: './src/assets',
                to: 'assets'
            }
        ]),
        new ImageminPlugin({
            pngquant: {
                quality: '65-70',
                speed: 1
            },
            optipng: {
                optimizationLevel: 1
            }
        })
    ].concat(htmlPlugins)
}

function jsLoaders() {
    const loaders = [{
        loader: 'babel-loader',
        options: {
            presets: [
                '@babel/preset-env'
            ]
        }
    }]
    return loaders
}

function cssLoaders() {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../'
            }
        }, 
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
    ];
    return loaders
}

module.exports = {
    entry : ['babel-polyfill', '~src/js/index.js'],
    output : {
        filename : 'js/[name].[hash].js',
        path : path.resolve(__dirname, '../dist')
    },
    resolve: {
        alias: {
            '@images': path.resolve(__dirname, '../assets/images'),
            '@fonts': path.resolve(__dirname, '../assets/fonts'),
            '~src': path.resolve(__dirname, '../src')
        }
    },
    plugins: generatePlugins(),
    module: {
        rules: [
            {
                test: /\.(sc|sa|c)ss$/,
                use: cssLoaders()
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /.(png|svg|jpg|gif)$/,
                use: [
                    { 
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images'
                        },
                    },
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/fonts'
                }
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        return `npm.${packageName.replace('@', '')}`;
                    }
                }
            }
        }
    }
}