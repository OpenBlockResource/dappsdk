const { DefinePlugin } = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const DIST = path.resolve(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === 'prod';

module.exports = [
  {
    devtool: isProduction ? undefined : 'eval',
    mode: isProduction ? 'production' : 'development',
    entry: {
      sdk: path.resolve(__dirname, 'src/index.js'),
    },
    resolve: {
      extensions: ['.mjs', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|cjs|jsx)$/u,
          type: 'javascript/auto',
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env']],
              plugins: [
                '@babel/plugin-proposal-class-properties',
              ]
            },
          },
        },
      ],
    },
    output: {
      path: DIST,
      publicPath: '/',
      filename: 'index.js',
    },
    devServer: {
      writeToDisk: true,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DefinePlugin({
        ENV: JSON.stringify(process.env.NODE_ENV || 'local'),
      }),
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false,
          },
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    optimization: {
      minimize: isProduction,
    },
  },
];
