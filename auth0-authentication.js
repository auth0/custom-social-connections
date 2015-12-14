(function (context) {
  'use strict';

  function authenticate() {
    var authorizationUrl = [
      context.env.authUrl,
      '?client_id=' + context.auth0.clientId,
      '&response_type=token',
      '&scope=' + encodeURIComponent(context.env.scopes),
      '&expiration=9999999999',
      '&redirect_uri=' + context.auth0.redirectUri
    ].join('');
    context.location.href = authorizationUrl;
  }

  var regex  = new RegExp(/token=(.*)[;]?/);
  var cookie = context.document.cookie;
  var data   = regex.exec(cookie);
  var token;
  var decoded;

  // Token not found
  if (data === null) {
    authenticate();
  }

  token = data.pop();

  try {
    decoded             = jwt_decode(token);
    // TODO: Rollback when API is fixed
    // context.env.apiUrl  = decoded.aud[0];
    // context.env.userUrl = decoded.aud[0].replace('/api/v2', '/authorize');
    context.env.apiUrl  = decoded.aud;
    context.env.userUrl = decoded.aud.replace('/api/v2', '/authorize');
    context.env.token   = token;

    var options = {
      url:         'https://auth0.auth0.com/userinfo',
      type:        'GET',
      contentType: 'application/json',
      headers:     {
        Authorization: 'Bearer ' + token
      }
    };

    // TODO: Rollback when API is fixed
    // $.ajax(options)
    //   .then(function (userInfo) {
    //     context.env.user = {
    //       nickname: userInfo.name, // userInfo.nickname
    //       email:    userInfo.name
    //     };

    //     // $('#user-picture').attr('src', user.picture);
    //     $('#username').text(userInfo.name);
    //   });
  } catch (err) {
    // Invalid token
    authenticate();
  }

  context.token = token;
})(window);
