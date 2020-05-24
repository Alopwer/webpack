const path = require('path')
const fs = require('fs')
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let templates = []
let dir = path.resolve(__dirname, '../', 'src')
let files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.match(/\.pug$/)) {
        let filename = file.substring(0, file.length - 4);
        templates.push(
            new HtmlWebpackPlugin({
                template: `${dir}/${filename}.pug`,
                filename: filename + '.html'
            })
        );
    }
});

module.exports = {
    entry: path.resolve(__dirname, '../', 'src/index.js'),
    output: {
        path: path.resolve(__dirname, '../', 'dist'),
        publicPath: '',
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.pug$/,
                use: [
                    "raw-loader",
                    "pug-html-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.scss']
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...templates,
        new HtmlWebpackPugPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: './src/assets',
                to: '../dist/assets'
            }
        ]}),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}