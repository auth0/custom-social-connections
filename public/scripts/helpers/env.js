(function (context) {
  'use strict';

  context.env = {
    clientId:    'N3PAwyqXomhNu6IWivtsa3drBfFjmWJL',
    authUrl:     'https://auth0.auth0.com/i/oauth2/authorize',
    callbackUrl: 'http://localhost:3000/callback.html',
    scopes:      'read:connections create:connections update:connections delete:connections read:clients',
    s3:          {
      accessKey: '',
      secret:    '',
      bucket:    ''
    }
  };
})(window);
