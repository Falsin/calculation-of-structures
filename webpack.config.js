const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin()
  ],
  devServer: {
    static: './dist',
  },
  optimization: {
    runtimeChunk: 'single',
  },
};