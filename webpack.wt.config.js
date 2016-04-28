var Request = require('request-promise');
var Webpack = require('webpack');
var _       = require('lodash');
var pkg     = require('./webtask.json');
var StringReplacePlugin = require("string-replace-webpack-plugin");

var LIST_MODULES_URL = 'https://webtask.it.auth0.com/api/run/wt-tehsis-gmail_com-1?key=eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJmZGZiOWU2MjQ0YjQ0YWYyYjc2YzAwNGU1NjgwOGIxNCIsImlhdCI6MTQzMDMyNjc4MiwiY2EiOlsiZDQ3ZDNiMzRkMmI3NGEwZDljYzgwOTg3OGQ3MWQ4Y2QiXSwiZGQiOjAsInVybCI6Imh0dHA6Ly90ZWhzaXMuZ2l0aHViLmlvL3dlYnRhc2tpby1jYW5pcmVxdWlyZS90YXNrcy9saXN0X21vZHVsZXMuanMiLCJ0ZW4iOiIvXnd0LXRlaHNpcy1nbWFpbF9jb20tWzAtMV0kLyJ9.MJqAB9mgs57tQTWtRuZRj6NCbzXxZcXCASYGISk3Q6c';

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
      'webtask-tools': false,
    }),
    plugins: [
      new StringReplacePlugin(),
      new Webpack.optimize.DedupePlugin()
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
