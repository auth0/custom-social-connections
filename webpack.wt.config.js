var Request = require('request-promise');
var Webpack = require('webpack');
var _       = require('lodash');
var pkg     = require('./webtask.json');
var StringReplacePlugin = require("string-replace-webpack-plugin");

var LIST_MODULES_URL = 'https://auth0-extensions.us.webtask.io/list_modules?key=eyJhbGciOiJIUzI1NiIsImtpZCI6InVzLTMifQ.eyJqdGkiOiI2MmE2MmEzZTc2NDA0OGJjOWJjZjg4OTA0YTM2MTViNSIsImlhdCI6MTUwNDgwNDMxMSwiY2EiOltdLCJkZCI6MSwidGVuIjoiYXV0aDAtZXh0ZW5zaW9ucyJ9.f7oityW3pq30eDhOUCb218n8YllhV-6wBO1NYBKBGNI';

module.exports = Request.get(LIST_MODULES_URL, { json: true }).then(function (data) {
  var modules = data.modules;

  return {
    entry: './webtask',
    output: {
      path: './dist',
      filename: pkg.name+'.js',
      library: true,
      libraryTarget: 'commonjs2',
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
                  return pkg.name + '-' + pkg.version;
                }.bind(this)
              }
            ]
          })
        },
        { test: /\.jade$/, loader: require.resolve('jade-loader') }
      ]
    },
    externals: _(modules).reduce(function (acc, module) {
        if (module.name === 'auth0-oauth2-express') {
          return _.set(acc, module.name, false);
        }

        return _.set(acc, module.name, true);
    }, {
      // Not provisioned via verquire
      'auth0-api-jwt-rsa-validation': true,
      'auth0-authz-rules-api': true,
      'auth0-oauth2-express': false,
      'auth0-sandbox-ext': true,
      'detective': true,
      'sandboxjs': true,
      'webtask-tools': true,
    }),
    plugins: [
      new StringReplacePlugin(),
      new Webpack.optimize.DedupePlugin(),
      new Webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
    ],
    resolve: {
      modulesDirectories: ['node_modules'],
      root: __dirname,
      alias: {},
    },
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false
    }
  };
});
