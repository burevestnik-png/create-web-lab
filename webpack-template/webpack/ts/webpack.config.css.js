const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const environment = process.env.NODE_ENV;

const isDevelopmentMode = environment === 'development'
const isProductionMode = !isDevelopmentMode

const createFileName = ( extension, output = '' ) => {
    return isDevelopmentMode ?
        `${ output }[name].${ extension }` :
        `${ output }[name].[contenthash].${ extension }`;
}

const createOptimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProductionMode) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "development",
    entry: './index.ts',
    output: {
        filename: createFileName('js', './static/js/'),
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html'),
            minify: {
                collapseWhitespace: isProductionMode
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: createFileName('css', './static/css/')
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public/favicon.ico'),
                    to: path.resolve(__dirname, 'build')
                },
                {
                    from: path.resolve(__dirname, 'public/logo.png'),
                    to: path.resolve(__dirname, 'build')
                },
                {
                    from: path.resolve(__dirname, 'server'),
                    to: path.resolve(__dirname, 'build/server/')
                }
            ]
        })
    ],
    optimization: createOptimization(),
    devServer: {
        port: 4300,
        hot: isDevelopmentMode
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDevelopmentMode,
                            reloadAll: true
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            }
        ]
    }
}
