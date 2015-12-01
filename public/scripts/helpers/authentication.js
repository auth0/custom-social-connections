(function (context) {
  'use strict';

  function authenticate() {
    var redirectUri = [
      context.env.callbackUrl,
      '&scope=' + encodeURIComponent(context.env.scopes),
      '&expiration=9999999999'
    ].join('');
    var authorizationUrl = [
      context.env.authUrl,
      '?client_id=' + context.env.clientId,
      '&response_type=token',
      '&redirect_uri=' + redirectUri
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
    context.env.apiUrl  = decoded.aud[0];
    context.env.userUrl = decoded.aud[0].replace('/api/v2', '/authorize');
    context.env.token   = token;

    var options = {
      url:         context.env.apiUrl + 'clients',
      type:        'GET',
      contentType: 'application/json',
      headers:     {
        Authorization: 'Bearer ' + token
      }
    };

    $.ajax(options)
      .then(function (clients) {
        var userId = clients.pop().owners.pop();

        options.url = context.env.apiUrl + 'users/' + userId;

        $.ajax(options)
          .then(function (user) {
            context.env.user = {
              nickname: user.nickname,
              email:    user.email
            };

            $('#user-picture').attr('src', user.picture);
            $('#username').text(user.name);
          });
      });
  } catch (err) {
    // Invalid token
    authenticate();
  }

  context.token = token;
})(window);
