const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'),
  BUNDLE_FILENAME: 'app.bundle.js',
  PUBLIC_PATH: '/',
};

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// share some specified env vars
const envKeys =['NODE_ENV', 'API_URL'].reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
  return prev;
}, {});

const plugins = [
  new webpack.DefinePlugin(envKeys),
  new HtmlWebpackPlugin({
    template: path.join(paths.SRC, '/index.html'),
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
];

const entry = {
  app: path.join(paths.SRC, 'app.jsx'),
};


const aliases = {};
if (process.env.NODE_ENV === 'development') {
  plugins.unshift(new webpack.HotModuleReplacementPlugin()); // append to the top
  aliases['react-dom'] = '@hot-loader/react-dom';
} else {
  plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'disabled', generateStatsFile: true }));
}

module.exports = {
  mode: process.env.NODE_ENV,
  entry,
  output: {
    path: paths.DIST,
    filename: 'ui.bundle.js',
    publicPath: paths.PUBLIC_PATH,
  },
  devServer: {
    contentBase: paths.DIST,
    hot: true,
    historyApiFallback: true,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: aliases,
  },
  module: {
    rules: [
      {
        test: /\.jsx?/i,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
