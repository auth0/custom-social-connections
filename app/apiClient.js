var $       = require('jQuery');
var context = window.env;

function expireCookie() {
  document.cookie = 'token=; expires=-1';
  window.location.href = '/';
}

function request(resource, method, body) {
  var options = {
    url:         context.apiUrl + resource,
    type:        method || 'GET',
    contentType: 'application/json',
    cache:       true,
    headers:     {
      Authorization: 'Bearer ' + context.token
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
    window.env.masterClientId = clients.pop().client_id;
  });

module.exports = {
  templates: {
    getAll: function getAll() {
      return window.templates;
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
        url:         window.env.webtasks.shareUrl,
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

    remove: function del(remove) {
      return request('connections/' + id, 'DELETE');
    }
  }
};
