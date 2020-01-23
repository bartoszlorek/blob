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
      '@actions': path.resolve(__dirname, 'src/actions/'),
      '@core': path.resolve(__dirname, 'src/core/'),
      '@data': path.resolve(__dirname, 'src/data/'),
      '@layers': path.resolve(__dirname, 'src/layers/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
    ],
  },
  externals: {
    'pixi.js': 'PIXI',
  },
};
