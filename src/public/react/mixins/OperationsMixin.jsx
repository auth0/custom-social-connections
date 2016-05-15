var ConnectionsStore = require('../stores/ConnectionsStore');
var Metrics          = require('../metrics.jsx');

function errorHandling(xhr, text, error) {
  var message = null;

  this.setState({
    saving:   false,
    deleting: false,
    sharing:  false
  });

  try {
    message = JSON.parse(xhr.statusCode().responseText).message;
  }
  catch (err) {
    console.log('Error reading error message', err);
  }

  this.state.connectionForm.showErrorMessage(message);
}

var OperationsMixin = {
  _create: function (connection, isShared, context, isTemplate) {
    ConnectionsStore.create(connection)
      .then(function (connection) {
        this._showMe('showSettings');

        Metrics.track('create', connection.name.toLowerCase());

        this.setState({
          mode:       '_update',
          title:      connection.name,
          showShare:  isShared ? false : true,
          showDelete: isTemplate === true ? false : true,
          showTry:    true,
          saving:     false,
          saved:      true
        });

        if (!isShared) {
          this.state.connectionForm.showInfo();
        }

        this.state.connectionForm.setState({
          mode:         '_update',
          defaultValue: connection
        });

        this.state.applicationsForm.setState({
          mode:         '_update'
        });
      }.bind(this))
      .fail(errorHandling.bind(this));
  },

  _update: function (connection, id, context) {
    var connectionName = connection.name.toLowerCase();
    delete connection.name;

    ConnectionsStore.update(id, connection)
      .then(function () {
        context.showSuccessMessage();

        Metrics.track('update', connectionName);

        this.setState({
          saving: false,
          saved:  true
        });
      }.bind(this))
      .fail(errorHandling.bind(this));
  },

  _save: function (context) {
    var clients    = this.state.applicationsForm.getSelectedClients();
    var connection = this.state.connectionForm.getConnection();
    var param      = this.state.mode === '_create' ? connection.isShared : connection.id;
    var isTemplate = connection.isTemplate;

    connection.enabled_clients = Object.keys(clients);
    delete connection.id;
    delete connection.isShared;
    delete connection.isTemplate;

    this.setState({saving: true});

    this[this.state.mode](connection, param, context, isTemplate);
  },

  _delete: function () {
    var connection = this.state.connectionForm.getConnection();

    this.setState({deleting: true});

    ConnectionsStore.remove(connection.id)
      .then(function () {

        Metrics.track('delete', connection.id.toLowerCase());

        this.setState({
          deleting: false
        });
        this._close();
      }.bind(this))
      .fail(errorHandling.bind(this));
  },

  _share: function (e) {
    e.preventDefault();

    if (confirm('IMPORTANT: You are about to share the parameters of this integration with the rest of the world as a Pull Request in GitHub. Make sure there is no sensitive information in the Fetch User Profile script. Do you want to continue?')) {
      var connection = this.state.connectionForm.getConnection();

      this.setState({sharing: true});

      ConnectionsStore.share({
        recipe:  connection.name,
        userInfo:    window.env.user,
        content: {
          name:     connection.name.toLowerCase(),
          strategy: 'oauth2',
          options: {
            authorizationURL: connection.options.authorizationURL,
            tokenURL:         connection.options.tokenURL,
            scope:            connection.options.scope,
            scripts:          {
              fetchUserProfile: connection.options.scripts.fetchUserProfile
            }
          }
        }
      }).then(function (data) {
        Metrics.track('share', connection.name.toLowerCase());

        this.setState({
          showPrLocation: true,
          showShare:      false,
          prLocation:     data.link,
          sharing:        false
        });
      }.bind(this))
      .fail(errorHandling.bind(this));
    }
  }
};

module.exports = OperationsMixin;
