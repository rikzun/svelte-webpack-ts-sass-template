const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const sveltePreprocess = require("svelte-preprocess")
const { typescript } = require("svelte-preprocess")
const path = require('path')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const PATH_ENTRY = path.join(__dirname, 'src', 'index.ts')
const PATH_TEMPLATE_ENTRY = path.join(__dirname, 'static', 'index.html')
const PATH_TYPESCRIPT_CONFIG = path.join(__dirname, 'tsconfig.json')

const PATH_OUTPUT_FOLDER = path.join(__dirname, 'build')
const PATH_STATIC_FOLDER = path.join(__dirname, 'static')
const PATH_SVELTE_FOLDER = path.join(__dirname, 'node_modules', 'svelte')

module.exports = {
  mode: IS_PRODUCTION ? 'production' : 'development',
  entry: PATH_ENTRY,
  output: {
    path: PATH_OUTPUT_FOLDER,
    filename: 'bundle.[fullhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: 'auto'
  },
  resolve: {
    alias: { svelte: PATH_SVELTE_FOLDER },
    fallback: { process: false },
    extensions: ['.ts', '.js', '.mjs', '.html', '.svelte', '.sass'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  devServer: {
    hot: true,
    open: true,
    port: 8080,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        exclude: PATH_STATIC_FOLDER,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            preprocess: sveltePreprocess({
              typescript: typescript({
                tsconfigFile: PATH_TYPESCRIPT_CONFIG
              })
            })
          }
        }
      },
      {
        // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
        test: /node_modules\/svelte\/.*\.mjs$/,
        exclude: PATH_STATIC_FOLDER,
        resolve: { fullySpecified: false }
      },
      {
        test: /\.ts$/,
        exclude: PATH_STATIC_FOLDER,
        loader: 'ts-loader'
      },
      {
        // load styles from svelte
        test: /\.css$/,
        exclude: PATH_STATIC_FOLDER,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: PATH_STATIC_FOLDER,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: PATH_TEMPLATE_ENTRY }),
    new ErrorOverlayPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash:8].css',
      chunkFilename: '[name].[chunkhash:8].css',
    })
  ],
  devtool: 'cheap-module-source-map'
}