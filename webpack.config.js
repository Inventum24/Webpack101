var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var bootstrapEntryPoints = require('./webpack.bootstrap.config');

var isProd = process.env.NODE_ENV === 'production'; //true or false
var cssDev = ['style-loader','css-loader','sass-loader'];
var cssProd =        
   ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader','sass-loader'],
            publicPath: '/dist'
         });

var cssConfig = isProd ? cssProd : cssDev;
var bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
  entry: {
    app: './src/app.js',
    contact: './src/contact.js',
    bootstrap: bootstrapConfig
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules: [
      {test: /\.scss$/, 
        use: cssConfig
      },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.pug$/,
        use: ["html-loader", "pug-html-loader"]
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff)$/,
        use: ["file-loader?name=images/[name].[ext]", 
              //"file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/", 
              'image-webpack-loader']
      },
      { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
      { test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
      { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' },
    ]
  },
  devServer: {
       contentBase: path.join(__dirname, "dist"),
       compress: true,
       port: 8888,
       hot: true,
       stats: "errors-only",
       open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
    title: 'Project Demo',
    //filename: 'index.html',
    template: './src/index.pug',
    excludeChunks: ['contact','bootstrap'],
    inject   : true,
    // minify: { collapseWhitespace: true},
    hash: true,
  }),
  new HtmlWebpackPlugin({
    title: 'Project2 Demo',
    filename: 'contact.html',
    template: './src/contact.html',
    chunks: ['contact'],
    // minify: { collapseWhitespace: true},
    hash: true,
  }),
  new HtmlWebpackPlugin({
    title: 'Project2 Demo',
    filename: 'booter.html',
    template: './src/booter.html',
    chunks: ['bootstrap'],
    // minify: { collapseWhitespace: true},
    hash: true,
  }),
   new ExtractTextPlugin({
       filename: "/css/[name].css",
       disable: !isProd, // HotModuleReplacementPlugin not work with ExtractTextPlugin that's why we set true
       allChunks: true
     }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
]
};
