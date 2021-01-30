const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

process.env.NODE_ENV = 'development';

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProd ? 'production' : 'development',
    devtool: !isProd && 'source-map',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                enforce: 'pre',
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-typescript',
                                [
                                    '@babel/preset-env',
                                    {
                                        useBuiltIns: 'entry',
                                        corejs: 3,
                                        modules: false,
                                        exclude: ['transform-typeof-symbol'],
                                    },
                                ],
                                '@babel/preset-react',
                            ],
                        },
                    },
                    {
                        loader: require.resolve('eslint-loader'),
                        options: {
                            eslintPath: require.resolve('eslint'),
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|woff2|woff)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    watch: !isProd,
    devServer: {
        hot: true,
        host: '0.0.0.0',
        port: 3000,
        disableHostCheck: true,
        historyApiFallback: true,
    },
};
