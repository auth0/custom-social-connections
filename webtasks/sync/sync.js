var request = require('request');
var Promise = require('bluebird');
var aws     = require('aws-sdk');

module.exports = function(context, req, res) {
  var config = {
    s3:     {
      accessKey: context.data.S3_ACCESS_KEY,
      secret:    context.data.S3_SECRET,
      bucket:    'assets.us.auth0.com/extensions/recipes',
      region:    'us-west-1'
    },
    github: {
      user: 'jcenturion',
      repo: 'hawkeye-recipes',
      path: 'recipes'
    }
  };
  var s3     = Promise.promisifyAll(new aws.S3({
    accessKeyId:     config.s3.accessKey,
    secretAccessKey: config.s3.secret,
    region:          config.s3.region,
    params:          {
      Bucket: config.s3.bucket
    }
  }));

  if (req.method === 'GET') {
    s3.listObjectsAsync({Bucket: 'assets.us.auth0.com', Prefix: 'extensions/recipes'})
      .then(function (data) {
        var promises = [];

        data.Contents.forEach(function (file) {
          var key = file.Key;
          if (key.indexOf('.json') >= 0 ) {
            promises.push(s3.getObjectAsync({Bucket: 'assets.us.auth0.com', Key: key}));
          }
        });

        Promise.all(promises)
          .map(function (data) {
            return data.Body.toString();
          })
          .map(function (data) {
            return JSON.parse(data);
          })
          .then(function (results) {
            res.writeHead(200);
            res.end(JSON.stringify(results));
          });
      });
  } else if (req.method === 'POST'){
    // PR is closed and merged
    if (context.body.action === 'closed' && context.body.pull_request.merged) {
      var reposUrl = 'https://api.github.com/repos/'+config.github.user+'/'+config.github.repo+'/contents/'+config.github.path;

      request({
        method: 'GET',
        uri: reposUrl,
        headers: {
          'User-Agent': 'webtask'
        }
      }, function (error, response, contents) {
        if (!error && response.statusCode == 200) {
          var promises = [];

          JSON.parse(contents).forEach(function (content) {
            if (content.name !== 'index.js') {
              var promise = new Promise(function (resolve, reject) {
                request({
                  method: 'GET',
                  uri: content.download_url,
                }, function (error, response, body) {
                  if (error) {
                    reject();
                  }

                  if (!error && response.statusCode == 200) {
                    resolve(body);
                  }
                });
              });

              promises.push(promise);
            }
          });

          Promise.all(promises).then(function (results) {
            var tasks = [];

            results.forEach(function (file) {
              var fileName = JSON.parse(file).name + '.json';

              tasks.push(s3.putObjectAsync({
                Key:  fileName,
                Body: file
              }));
            });

            return Promise.all(tasks);
          }).then(function () {
            // cb(null, {status: 'success'});
            res.writeHead(200);
            res.end(JSON.stringify({status: 'success'}));
          }).catch(function (e) {
            res.writeHead(500);
            res.end(JSON.stringify({
              error: e,
              status: 'Error uploading to S3'
            }));
          });
        } else {
          res.writeHead(500);
          res.end(JSON.stringify({
            error: error,
            status: 'Error getting contents'
          }));
        }
      });
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({status: 'PR not merged'}));
    }
  }
}
