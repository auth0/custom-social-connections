(function (context) {
  'use strict';

  context.env = {
    // clientId:    'sOZFZyH5MXSRH3uqmjjHf5eT7GYWAjIx',
    // authUrl:     'https://auth0.dev.auth0.com/i/oauth2/authorize',
    clientId:    'N3PAwyqXomhNu6IWivtsa3drBfFjmWJL',
    authUrl:     'https://auth0.auth0.com/i/oauth2/authorize',
    callbackUrl: 'http://localhost:3000/callback.html',
    // TODO: Rollback when API is fixed
    scopes:      'read:connections create:connections update:connections delete:connections read:clients read:users', //openid profile
    s3:          {
      accessKey: '',
      secret:    '',
      bucket:    ''
    },
    webtasks: {
      shareUrl:     'https://webtask.it.auth0.com/api/run/wt-centurion_javier-gmail_com-0/share-task?webtask_no_cache=1',
      templatesUrl: 'https://webtask.it.auth0.com/api/run/wt-centurion_javier-gmail_com-0/sync?webtask_no_cache=1'
    }
  };
})(window);
