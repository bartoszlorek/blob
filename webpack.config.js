const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'scripts.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@gui': path.resolve(__dirname, 'src/gui/'),
      '@layers': path.resolve(__dirname, 'src/layers/'),
      '@levels': path.resolve(__dirname, 'src/levels/'),
      '@models': path.resolve(__dirname, 'src/models/'),
      '@state': path.resolve(__dirname, 'src/state/'),
      '@traits': path.resolve(__dirname, 'src/traits/'),
      '@utils': path.resolve(__dirname, 'src/utils/')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  },
  externals: {
    'pixi.js': 'PIXI',
    react: 'React',
    'react-dom': 'ReactDOM'
  }
};
