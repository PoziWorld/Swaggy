const path = require( 'path' );
const { List, Map } = require( 'immutable' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const ChromeExtensionReloader = require( 'webpack-chrome-extension-reloader' );

const modeDevelopment = process.env.NODE_ENV === 'development';

const defaultConfig = Map( {
  entry: {
    'manifest': './src/manifest.json',
    'background': './src/background/background.js',
    'content-script': './src/content-scripts/content-script.js',
    'options': './src/options/options.js',
  },
  output: Map( {
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve( __dirname, 'dist' ),
  } ),
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /manifest.json$/,
        exclude: /node_modules/,
        loader: 'manifest-loader',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: [
            'env',
            'react',
          ],
          plugins: [
            'syntax-dynamic-import',
            'transform-class-properties',
            'transform-runtime',
          ],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require( 'precss' )(),
              ],
            },
          },
        ],
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        exclude: [
          /node_modules/,
          /manifest.json$/,
        ],
        loader: 'json-loader',
      },
      {
        test: /\.(png|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  plugins: List( [
    new MiniCssExtractPlugin( {
      filename: '[name].css',
    } ),

    new CopyWebpackPlugin(
      [
        {
          from: './src/_locales',
          to: './_locales',
        },
        {
          from: './src/shared/images/*-icon-*.png',
          to: './icons/[name].[ext]',
        },
        {
          from: './src/*/*.html',
          to: './[name].[ext]',
        },
      ]
    ),

    new ChromeExtensionReloader(),
  ] ),
  resolve: {
    alias: {
      Shared: path.resolve( __dirname, 'src', 'shared' ),
      Models: path.resolve( __dirname, 'src', 'shared', 'models' ),
      Background: path.resolve( __dirname, 'src', 'background' ),
      ContentScripts: path.resolve( __dirname, 'src', 'content-scripts' ),
    },
    extensions: [
      '.mjs',
      '.js',
      '.css',
    ],
  },
  resolveLoader: {
    modules: [
      path.resolve( __dirname, 'src', 'loaders' ),
      'node_modules',
    ],
  },
  node: {
    fs: 'empty',
  },
  devtool: modeDevelopment ? 'source-map' : undefined,
  watch: modeDevelopment,
} );

const supportedBrowsers = [
  'chromium',

  /**
   * @todo Uncomment when Speech Recognition API is implemented. https://caniuse.com/#feat=speech-recognition | https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility
   */

  // 'firefox',
  // 'edge',
];

module.exports = supportedBrowsers.map( browserName => {
  return defaultConfig
    // Separate dist folder for each browser
    .updateIn(
      [
        'output',
        'path',
      ],
      () => path.resolve( __dirname, 'dist', browserName ),
    )
    .toJS()
    ;
} );
