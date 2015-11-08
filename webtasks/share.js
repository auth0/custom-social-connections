var GitHubApi = require('github@0.2.4');

module.exports = function(context, cb) {
  if (context.body) {
    var config = {
      user: 'jcenturion',
      repo: 'hawkeye-recipes',
      commitMessage: function () {
        return 'Contributing with recipe \'' + this.recipe + '\'';
      },
      getFilePath: function () {
        return 'recipes/' + this.recipe.replace(/ /g, '-').toLocaleLowerCase() + '.json';
      },
      getReferenceName: function () {
        return 'recipes/' + this.username.replace(/ /g, '-').toLocaleLowerCase() + '/' + this.recipe.replace(/ /g, '-').toLocaleLowerCase();
      }
    };
    var github = new GitHubApi({
      version:  '3.0.0',
      protocol: 'https',
      host:     'api.github.com',
      timeout:  5000,
    });

    config.recipe   = context.body.recipe;
    config.content  = context.body.content;
    config.username = context.body.username;

    github.authenticate({
      type:  'token',
      token: '[YOUR-TOKEN-HERE]'
    });

    github.gitdata.getAllReferences({
        user: config.user,
        repo: config.repo,
      }, function(err, res) {
        var lastCommitSHA = res.filter(function (repo) { return repo.ref === 'refs/heads/master'}).pop().object.sha;
        var treeSHA;
        var commitSHA;

        if (err !== null) {
          cb(null, {
            step:  'GETTING REFERENCES',
            error: err
          });
        }

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
              cb(null, {
                step:  'FILE CREATION',
                error: err
              });
            }

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
                  name:  'Connection Dashboard',
                  email: 'auth0@support.com',
                  date:  (new Date()).toISOString()
                }
              }, function(err, res) {
                if (err !== null) {
                  cb(null, {
                    step:  'COMMIT CREATION',
                    error: err
                  });
                }

                commitSHA = res.sha;
                // Create a Reference
                github.gitdata.createReference({
                    user: config.user,
                    repo: config.repo,
                    ref:  'refs/heads/' + config.getReferenceName(),
                    sha:  commitSHA
                  }, function(err, res) {
                    if (err !== null) {
                      cb(null, {
                        step:  'REFERENCE CREATION',
                        error: err
                      });
                    }
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
                          cb(null, {
                            step:  'PR CREATION',
                            error: err
                          });
                        }

                        cb(null, {
                          link: res.html_url
                        });
                      });
                  });
              });
          });
      });
  } else {
    cb(null, {});
  }
}
