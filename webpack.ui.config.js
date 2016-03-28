var webpack = require('webpack');
var pkg     = require('./webtask.json');

var StringReplacePlugin = require("string-replace-webpack-plugin");

module.exports = {
  entry: './src/public/react/app',
  output: {
    filename: './dist/public/'+pkg.name+'-'+pkg.version+'.min.js'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      loader: 'jsx-loader?insertPragma=React.DOM&harmony'
    }, {
      test: /\metrics.jsx$/,
      loader: StringReplacePlugin.replace({
        replacements: [
          {
            pattern: /@segmentKey/ig,
            replacement: function (match, p1, offset, string) {
              return process.env.SEGMENT_KEY_DEV;
            }.bind(this)
          },
          {
            pattern: /@dwhEndpoint/ig,
            replacement: function (match, p1, offset, string) {
              return process.env.DWH_ENDPOINT_DEV;
            }.bind(this)
          }
        ]
      })
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new StringReplacePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
