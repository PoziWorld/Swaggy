const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {
  entry: {
    'voice-control': './src/content-scripts/voice-control.js',
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\/.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: [
            'env',
          ],
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin(
      [
        './src/manifest.json',
        {
          from: './src/_locales',
          to: './_locales',
        },
        {
          from: './src/shared/images/*-icon-*.png',
          to: './icons/[name].[ext]',
        },
      ]
    ),
  ],
  resolve: {
    extensions: [
      '.js',
    ],
  },
  watch: process.env.NODE_ENV === 'development',
};
