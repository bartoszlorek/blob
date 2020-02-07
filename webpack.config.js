const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'scripts.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@app': path.resolve(__dirname, 'src/'),
      '@core': path.resolve(__dirname, 'src/core/'),
      '@data': path.resolve(__dirname, 'src/data/'),
      '@layers': path.resolve(__dirname, 'src/layers/'),
      '@traits': path.resolve(__dirname, 'src/traits/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
    ],
  },
  externals: {
    'pixi.js': 'PIXI',
  },
};
