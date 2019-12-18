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
      '@gui': path.resolve(__dirname, 'src/gui/'),
      '@layers': path.resolve(__dirname, 'src/layers/'),
      '@levels': path.resolve(__dirname, 'src/levels/'),
      '@models': path.resolve(__dirname, 'src/models/'),
      '@physics': path.resolve(__dirname, 'src/physics/'),
      '@state': path.resolve(__dirname, 'src/state/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },
  },
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
