var request = require('request');
var Promise = require('bluebird');
var aws     = require('aws-sdk');
var Github  = require('github');
var express = require('express');
var Webtask = require('webtask-tools');
var api     = express();

// Load the AWS
api.use('/sync', function (req, res, next) {
  var settings = req.webtaskContext.data;

  req.aws = Promise.promisifyAll(new aws.S3({
    accessKeyId:     settings.S3_ACCESS_KEY,
    secretAccessKey: settings.S3_SECRET,
    region:          settings.S3_REGION,
    params:          {
      Bucket: settings.S3_BUCKET
    }
  }));

  next();
});

api.get('/sync', function (req, res) {
  req.aws.getObjectAsync({
    Key: 'extensions/recipes/recipes.json'
  }).then(function (data) {
    res.status(200);
    res.send(data.Body.toString());
  });
});

api.post('/sync', function (req, res) {
  var context  = req.webtaskContext;
  var settings = context.data;

  if (!(context.body.action === 'closed' && context.body.pull_request.merged)) {
    res.status(200);
    res.send(JSON.stringify({status: 'PR not merged'}));
    return;
  }

  var reposUrl = 'https://api.github.com/repos/'+settings.GH_USER+'/'+settings.GH_REPO+'/contents/'+settings.GH_PATH;

  request({
    method: 'GET',
    uri: reposUrl,
    headers: {
      'User-Agent': 'webtask'
    }
  }, function (error, response, contents) {
    if (error) {
      res.status(500);
      res.send({
        error: error,
        status: 'Error getting contents'
      });
      return;
    }

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

        tasks.push(req.aws.putObjectAsync({
          Key:  'extensions/recipes/recipes.json',
          Body: JSON.stringify(recipes)
        }));

        return Promise.all(tasks);
      }).then(function () {
        res.status(200);
        res.send(JSON.stringify({status: 'success'}));
      }).catch(function (e) {
        res.status(500);
        res.send(JSON.stringify({
          error: e,
          status: 'Error uploading to S3'
        }));
      });
    }
  });
});

// Load Github config
api.use('/share', function (req, res, next) {
  var context = req.webtaskContext;

  var config  = {
    user: context.data.GH_USER,
    repo: context.data.GH_REPO,
    commitMessage: function () {
      return 'Contributing with recipe \'' + this.recipe + '\'';
    },
    getFilePath: function () {
      return 'recipes/' + this.recipe.replace(/ /g, '-').toLocaleLowerCase() + '.json';
    },
    getReferenceName: function () {
      return 'recipes/' + this.userInfo.nickname.replace(/ /g, '-').toLocaleLowerCase() + '/' + this.recipe.replace(/ /g, '-').toLocaleLowerCase();
    }
  };

  config.recipe   = context.body.recipe;
  config.content  = context.body.content;
  config.userInfo = context.body.userInfo;

  if (typeof config.userInfo === 'undefined' || config.userInfo === null) {
    config.userInfo = { nickname: 'anonymous', email: 'auth0@support.com' };
  }

  config.userInfo.nickname = config.userInfo.nickname || 'anonymous';
  config.userInfo.email    = config.userInfo.email || 'auth0@support.com';

  var github = new Github({
    version:  '3.0.0',
    protocol: 'https',
    host:     'api.github.com',
    timeout:  5000,
  });

  github.authenticate({
    type:  'token',
    token: context.data.GH_TOKEN
  });

  req.config = config;
  req.client = github;

  next();
});

api.post('/share', function (req, response) {
  var github = req.client;
  var config = req.config;

  github.gitdata.getAllReferences({
      user: config.user,
      repo: config.repo,
    }, function(err, res) {
      if (err !== null) {
        response.status(500);
        response.send({
          step:  'GETTING REFERENCES',
          error: err
        });
        return;
      } else {
        var lastCommitSHA = res.filter(function (repo) { return repo.ref === 'refs/heads/master'}).pop().object.sha;
        var treeSHA;
        var commitSHA;

        // Create a File
        github.gitdata.createTree({
            base_tree: lastCommitSHA,
            user: config.user,
            repo: config.repo,
            tree: [{
              path:    config.getFilePath(),
              mode:    '100644',
              type:    'blob',
              content: JSON.stringify(config.content)
            }]
          }, function (err, res) {
            if (err !== null) {
              response.status(500);
              response.send({
                step:  'FILE CREATION',
                error: err
              });
              return;
            } else {
              treeSHA = res.sha;
              // Create a Commit
              github.gitdata.createCommit({
                  user:    config.user,
                  repo:    config.repo,
                  message: config.commitMessage(),
                  tree:    treeSHA,
                  parents: [
                    lastCommitSHA // -> Master lastcommit
                  ],
                  author: {
                    name:  config.userInfo.nickname,
                    email: config.userInfo.email,
                    date:  (new Date()).toISOString()
                  }
                }, function(err, res) {
                  if (err !== null) {
                    response.status(500);
                    response.send({
                      step:  'COMMIT CREATION',
                      error: err
                    });
                    return;
                  } else {
                    commitSHA = res.sha;
                    // Create a Reference
                    github.gitdata.createReference({
                        user: config.user,
                        repo: config.repo,
                        ref:  'refs/heads/' + config.getReferenceName(),
                        sha:  commitSHA
                      }, function(err, res) {
                        if (err !== null) {
                          response.status(500);
                          response.send({
                            step:  'REFERENCE CREATION',
                            error: err
                          });
                          return;
                        } else {
                          // Create a PR
                          github.pullRequests.create({
                              user:  config.user,
                              repo:  config.repo,
                              title: config.commitMessage(),
                              body:  '',
                              base:  'master',
                              head:  config.getReferenceName()
                            }, function(err, res) {
                              if (err !== null) {
                                response.status(500);
                                response.send({
                                  step:  'PR CREATION',
                                  error: err
                                });
                                return;
                              }

                              response.status(201);
                              response.send({
                                link: res.html_url
                              });
                            });
                        }
                      });
                  }
                });
            }
          });
      }
    });
});

module.exports = Webtask.fromExpress(api);
