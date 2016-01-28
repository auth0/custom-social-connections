var webpack = require('webpack');
var pkg     = require('./webtask.json');

module.exports = {
  entry: './src/public/react/app',
  output: {
    filename: './dist/public/'+pkg.name+'-'+pkg.version+'.min.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader?insertPragma=React.DOM&harmony'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
