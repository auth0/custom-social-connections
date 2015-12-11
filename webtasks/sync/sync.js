var request = require('request');
var Promise = require('bluebird');
var aws     = require('aws-sdk');

module.exports = function(context, req, res) {
  var config = {
    s3:     {
      accessKey: context.data.S3_ACCESS_KEY,
      secret:    context.data.S3_SECRET,
      bucket:    context.data.S3_BUCKET,
      region:    context.data.S3_REGION
    },
    github: {
      user: context.data.user,
      repo: context.data.repo,
      path: context.data.path
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
    s3.getObjectAsync({Bucket: 'assets.us.auth0.com', Key: 'extensions/recipes/recipes.json'})
      .then(function (data) {
        res.writeHead(200);
        res.end(data.Body.toString());
      });
  } else if (req.method === 'POST') {
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
            var tasks   = [];
            var recipes = [];

            results.forEach(function (file) {
              var parsed = JSON.parse(file);
              recipes.push(parsed);
            });

            tasks.push(s3.putObjectAsync({
              Key:  'recipes.json',
              Body: JSON.stringify(recipes)
            }));

            return Promise.all(tasks);
          }).then(function () {
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
