var context = window;

function expireCookie() {
  document.cookie = 'token=; expires=-1';
  context.location.href = '/';
}

function readUserAPIUrl () {
  var token = context.sessionStorage.getItem('token');
  return jwt_decode(token).aud.slice(0,1).pop();
}

function request(resource, method, body) {
  var options = {
    url:         readUserAPIUrl() + resource,
    type:        method || 'GET',
    contentType: 'application/json',
    cache:       true,
    headers:     {
      Authorization: 'Bearer ' + context.sessionStorage.getItem('token')
    },
    error: function (xhr, status, err) {
      // TODO: Show errors
      // expireCookie();
      console.log(err);
    }.bind(this)
  };

  if (body) {
    options.data = JSON.stringify(body);
  }

  return $.ajax(options);
}

request('clients')
  .then(function (clients) {
    context.env.masterClientId = clients.pop().client_id;
  });

module.exports = {
  templates: {
    getAll: function getAll() {
      var options = {
        url:         context.env.webtasks.templatesUrl,
        type:        'GET',
        contentType: 'application/json',
        error: function (xhr, status, err) {
          console.log(err);
        }.bind(this)
      };

      return $.ajax(options);
    }
  },
  clients: {
    getAll: function getAll() {
      return request('clients');
    }
  },
  connections: {
    share: function share(body) {
      var options = {
        url:         context.env.webtasks.shareUrl,
        type:        'POST',
        contentType: 'application/json',
        data:        JSON.stringify(body),
        error: function (xhr, status, err) {
          console.log(err);
        }.bind(this)
      };

      return $.ajax(options);
    },

    getById: function getById(id) {
      return request('connections/' + id);
    },

    getAll: function getAll() {
      return request('connections?strategy=oauth2');
    },

    create: function create(data) {
      return request('connections', 'POST', data);
    },

    update: function update(id, data) {
      return request('connections/' + id, 'PATCH', data);
    },

    remove: function del(id) {
      return request('connections/' + id, 'DELETE');
    }
  }
};
