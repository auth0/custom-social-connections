var fs      = require('fs');
var webpack = require('webpack');
var pkg     = require('./webtask.json');

var StringReplacePlugin = require("string-replace-webpack-plugin");

function readExternals() {
  // We need to exclude node_modules, otherwise webpack will bundle them
  var nodeModules = {};

  fs.readdirSync('./node_modules')
    .filter(function (x) {
      return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
      nodeModules[mod] = 'commonjs ' + mod;
    });

  return nodeModules;
}

module.exports = {
  target:      'node',
  node:        {
    __dirname:  false,
    __filename: true
  },
  entry: './server',
  externals: readExternals(),
  output: {
    path: './dist',
    filename: pkg.name+'.js'
  },
  module: {
    loaders: [
      {
        test: /\.jade$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /@assets_baseurl/ig,
              replacement: function (match, p1, offset, string) {
                var location = 'http://localhost:3000';

                if ((process.env.NODE_ENV || 'development') !== 'development') {
                  location = 'https://cdn.auth0.com/extensions/' + pkg.name + '/assets';
                }

                return location;
              }.bind(this)
            },
            {
              pattern: /@extension_name/ig,
              replacement: function (match, p1, offset, string) {
                return pkg.name+'-'+pkg.version;
              }.bind(this)
            }
          ]
        })
      },
      { test: /\.jade$/, loader: require.resolve('jade-loader') }
    ]
  },
  plugins: [
    new StringReplacePlugin(),
    new webpack.BannerPlugin('module.exports = ', {raw: true, entryOnly: false}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
