const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const sveltePreprocess = require("svelte-preprocess")
const { typescript } = require("svelte-preprocess")
const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'
const paths = {
  entry: path.join(__dirname, 'src', 'index.ts'),
  template: path.join(__dirname, 'static', 'index.html'),
  outputDir: path.join(__dirname, 'dist'),
  staticDir: path.join(__dirname, 'static')
}

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: paths.entry,
  output: {
    path: paths.outputDir,
    filename: 'bundle.[fullhash:8].js',
    chunkFilename: '[name].[chunkhash:8].js',
    publicPath: 'auto'
  },
  resolve: {
    alias: {
      // required for svelte to work
      svelte: path.join(__dirname, 'node_modules', 'svelte')
    },
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
        exclude: paths.staticDir,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,

            // hide warn messages in site
            onwarn: (error) => {
              console.log(error.toString())
            },

            // load typescript
            preprocess: sveltePreprocess({
              typescript: typescript()
            })
          }
        }
      },
      {
        // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
        test: /node_modules\/svelte\/.*\.mjs$/,
        exclude: paths.staticDir,
        resolve: { fullySpecified: false }
      },
      {
        test: /\.ts$/,
        exclude: paths.staticDir,
        loader: 'ts-loader'
      },
      {
        // load styles from svelte
        test: /\.css$/,
        exclude: paths.staticDir,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: path.staticDir,
        type: 'asset/resource',
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: paths.template }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash:8].css',
      chunkFilename: '[name].[chunkhash:8].css',
    })
  ]
}