(function (context) {
  'use strict';

  context.templates = [
    {
      "name": "dropbox",
      "strategy": "oauth2",
      "options": {
        "authorizationURL": "https://www.dropbox.com/1/oauth2/authorize",
        "tokenURL": "https://api.dropbox.com/1/oauth2/token",
        "scripts": {
          "fetchUserProfile": "function(accessToken,ctx,cb){request.get('https://api.dropbox.com/1/account/info',{headers:{'Authorization':'Bearer '+accessToken}},function(e,r,b){if(e) return cb(e);if(r.statusCode!==200) return cb(new Error('StatusCode: '+r.statusCode));var profile=JSON.parse(b);cb(null,{user_id:profile.uid,family_name:profile.name_details.surname,given_name:profile.name_details.given_name,email:profile.email,email_verified:profile.email_verified,locale:profile.locale,is_paired:profile.is_paired,country:profile.country,dropbox_team:profile.team,dropbox_referral_link:profile.referral_link});});}"
        }
      }
    },
    {
      "name": "uber",
      "strategy": "oauth2",
      "options": {
        "authorizationURL": "https://login.uber.com/oauth/authorize",
        "tokenURL": "https://login.uber.com/oauth/token",
        "scope": "profile",
        "scripts": {
          "fetchUserProfile": "function(accessToken, ctx, cb) { request.get('https://api.uber.com/v1/me', { headers: { 'Authorization': 'Bearer ' + accessToken } }, function(e, r, b) { if (e) return cb(e); if (r.statusCode !== 200 ) return cb(new Error('StatusCode: ' + r.statusCode)); var profile = JSON.parse(b); profile.user_id = profile.uuid; cb(null, profile); });}"
        }
      }
    },
    {
      "name": "digitalocean",
      "strategy": "oauth2",
      "options": {
        "authorizationURL": "https://cloud.digitalocean.com/v1/oauth/authorize",
        "tokenURL": "https://cloud.digitalocean.com/v1/oauth/token",
        "scope": "read",
        "scripts": {
          "fetchUserProfile": "function(accessToken, ctx, cb) { request.get('https://api.digitalocean.com/v2/account', { headers: { 'Authorization': 'Bearer ' + accessToken } }, function(e, r, b) { if (e) return cb(e); if (r.statusCode !== 200 ) return cb(new Error('StatusCode: ' + r.statusCode)); var profile = JSON.parse(b).account; profile.user_id = profile.uuid; cb(null, profile); });}"
        }
      }
    },
    {
      "name": "imgur",
      "strategy": "oauth2",
      "options": {
        "authorizationURL": "https://api.imgur.com/oauth2/authorize",
        "tokenURL": "https://api.imgur.com/oauth2/token",
        "scripts": {
          "fetchUserProfile": "function(accessToken, ctx, cb) { request.get('https://api.imgur.com/3/account/me', { headers: { 'Authorization': 'Bearer ' + accessToken } }, function(e, r, b) { if (e) return cb(e); if (r.statusCode !== 200 ) return cb(new Error('StatusCode: ' + r.statusCode)); var profile = JSON.parse(b).data; profile.user_id = profile.id; cb(null, profile); });}"
        }
      }
    },
    {
      "name": "twitch",
      "strategy": "oauth2",
      "options": {
        "authorizationURL": "https://api.twitch.tv/kraken/oauth2/authorize",
        "tokenURL": "https://api.twitch.tv/kraken/oauth2/token",
        "scope": "user_read",
        "scripts": {
          "fetchUserProfile": "function(accessToken, ctx, cb){ request.get('https://api.twitch.tv/kraken/user', { headers: { 'Authorization': 'OAuth ' + accessToken, 'Accept': 'application/vnd.twitchtv.v3+json' } }, function(e, r, b) { if (e) return cb(e); if (r.statusCode !== 200 ) return cb(new Error('StatusCode: ' + r.statusCode)); var profile = JSON.parse(b); profile.id = profile._id; delete profile._id; profile.links=profile._links; delete profile._links; return cb(null, profile);});}"
        }
      }
    },
    {
      "name": "dribbble",
      "strategy": "oauth2",
      "options": {
        "authorizationURL": "https://dribbble.com/oauth/authorize",
        "tokenURL": "https://dribbble.com/oauth/token",
        "scope": "public",
        "scripts": {
          "fetchUserProfile": "function(accessToken, ctx, cb) { request.get('https://api.dribbble.com/v1/user', { headers: { 'Authorization': 'Bearer ' + accessToken } }, function(e, r, b) { if (e) return cb(e); if (r.statusCode !== 200 ) return cb(new Error('StatusCode: ' + r.statusCode)); var profile = JSON.parse(b); profile.user_id = profile.id; profile.picture = profile.avatar_url; cb(null, profile); });}"
        }
      }
    },
    {
      "name": "vimeo",
      "strategy": "oauth2",
      "options": {
        "authorizationURL": "https://api.vimeo.com/oauth/authorize",
        "tokenURL": "https://api.vimeo.com/oauth/access_token",
        "scope": "public",
        "scripts": {
          "fetchUserProfile": "function(accessToken, ctx, cb) { request.get('https://api.vimeo.com/me', { headers: { 'Authorization': 'Bearer ' + accessToken } }, function(e, r, b) { if (e) return cb(e); if (r.statusCode !== 200 ) return cb(new Error('StatusCode: ' + r.statusCode)); var profile = JSON.parse(b); profile.user_id = profile.uri; cb(null, profile); });}"
        }
      }
    }
  ];
})(window);
