var ConnectionsStore = require('../stores/ConnectionsStore');

var OperationsMixin = {
  _create: function (connection, isShared) {
    ConnectionsStore.create(connection)
      .then(function (connection) {
        this._showMe('showSettings');

        this.setState({
          mode:       '_update',
          title:      connection.name,
          showShare:  isShared ? false : true,
          saving:     false
        });

        if (!isShared) {
          this.state.connectionForm.showInfo();
        }

        this.state.connectionForm.setState({
          mode:         '_update',
          defaultValue: connection,
        });

        this.state.applicationsForm.setState({
          mode:         '_update'
        });

        this.state.tryFrom.setState({
          mode:         '_update',
          clientIds:    connection.enabled_clients,
          connection:   connection
        });

        this.state.tryFrom.refs.application.setState({
          value: connection.enabled_clients.slice(0,1).shift()
        });

      }.bind(this));
  },

  _update: function (connection, id, context) {
    ConnectionsStore.update(id, connection)
      .then(function () {
        context.showSuccessMessage();

        setTimeout(function () {
          context.setState({
            successMessage: {display: 'none'}
          });
        }.bind(this), 5000);

        this.setState({
          saving: false
        });
      }.bind(this));
  },

  _save: function (context) {
    var clients    = this.state.applicationsForm.getSelectedClients();
    var connection = this.state.connectionForm.getConnection();
    var param      = this.state.mode === '_create' ? connection.isShared : connection.id;

    connection.enabled_clients = Object.keys(clients);
    delete connection.id;
    delete connection.isShared;

    this.setState({saving: true});

    this[this.state.mode](connection, param, context);
  },

  _delete: function () {
    var connection = this.state.connectionForm.getConnection();

    this.setState({deleting: true});

    ConnectionsStore.remove(connection.id)
      .then(function () {
        this.setState({
          deleting: false
        });
        this._close();
      }.bind(this));
  },

  _share: function () {
    var connection = this.state.connectionForm.getConnection();

    this.setState({sharing: true});

    ConnectionsStore.share({
      recipe:  connection.name,
      userInfo:    window.env.user,
      content: {
        name:     connection.name,
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
      this.setState({
        showPrLocation: true,
        showShare:      false,
        prLocation:     data.link,
        sharing:        false
      });
    }.bind(this));
  }
};

module.exports = OperationsMixin;
