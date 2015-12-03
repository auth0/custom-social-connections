var React      = require('react');
var Switch     = require('./Switch.react');
var classNames = require('classnames');

var ConnectionForm = require('./ConnectionForm.react');
var Applications   = require('./Applications.react');
var Try            = require('./Try.react');

var ConnectionsStore = require('../stores/ConnectionsStore');

var ConnectionModal = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    mode:  React.PropTypes.string
  },
  getInitialState: function () {
    return {
      showSettings:   true,
      showApps:       false,
      showTry:        false,
      connection:     this.props.connection || {strategy:'oauth2', options: {scripts: {
        fetchUserProfile: [
                          'function(accessToken, ctx, cb) {',
                          ' // call oauth2 APIwith the accesstoken and create the profile',
                          ' cb(null, profile);',
                          '}'
                          ].join('\n')
      }}, enabled_clients: undefined},
      title:          this.props.title || 'New Connection',
      mode:           this.props.mode || '_create',
      showPrLocation: false,
      showShare:      this.props.mode === '_update' ? (this.props.connection.isShared === true ? false : true) : false,
      showDelete:     this.props.mode === '_update' ? (this.props.connection.isTemplate === true ? false : true) : false,
      prLocation:     '#',
      sharing:        false,
      saving:         false,
      deleting:       false,
    };
  },

  componentDidMount: function () {
    // TODO: Use refs
    this.setState({
      connectionForm:   React.render(<ConnectionForm onShare={this._share} defaultValue={this.state.connection} mode={this.state.mode}/>, document.getElementById('connectionForm')),
      applicationsForm: React.render(<Applications defaultValue={this.state.connection.enabled_clients}/>, document.getElementById('applicationsForm')),
      tryFrom:          React.render(<Try connection={this.state.connection} clientIds={this.state.connection.enabled_clients}/>, document.getElementById('tryForm'))
    });
  },

  _close: function() {
    React.unmountComponentAtNode(document.getElementById('connectionModal'));
  },

  _showSettings: function () {
    this.setState({
      showSettings: true,
      showApps:     false,
      showTry:      false
    });
  },

  _showApps: function () {
    this.setState({
      showSettings: false,
      showApps:     true,
      showTry:      false
    });
  },

  _showTry: function () {
    this.setState({
      showTry:      true,
      showSettings: false,
      showApps:     false
    });
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
  },

  _create: function (connection, isShared) {
    ConnectionsStore.create(connection)
      .then(function (connection) {
        this._showSettings();

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

  _saveApplications: function () {
    this._save(this.state.applicationsForm);
  },

  _saveConnection: function () {
    this._save(this.state.connectionForm);
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

  render: function () {
    var hide = this.state.mode === '_create';

    return (
      <div
        id="new-connection-modal"
        className="modal centered in"
        data-keyboard="true"
        tabIndex="-1"
        aria-hidden="false"
        style={{overflowY: 'auto', display: 'block'}}>
        <div className="modal-backdrop in"></div>
        <div className="modal-dialog">
          <div className="modal-content" id="new-connection-tab-content">
            <div className="modal-header">
              <button onClick={this._close} type="button" className="close"><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
              <h4 className="modal-title" style={{textTransform: 'capitalize'}}>{this.state.title}</h4>
            </div>
            <div className="form-wrapper">
              <ul className="nav nav-tabs">
                <li className={classNames({'active': this.state.showSettings})}><a href="#" onClick={this._showSettings}>Settings</a></li>
                <li className={classNames({'active': this.state.showApps})}><a href="#" onClick={this._showApps}>Apps</a></li>
                <li className={classNames({'active': this.state.showTry})}><a href="#" onClick={this._showTry}>Try</a></li>
              </ul>
            </div>
            <div className="tab-content">

                <div id="apps-selector" className={classNames({'tab-pane': true, 'active': this.state.showApps})}>
                  <form className="connection-form form-horizontal" onSubmit={this._saveApplications}>
                    <div id="applicationsForm"></div>
                    <div className="modal-footer text-center">
                      <button type="submit" className="btn btn-primary save">
                        <span className={classNames({'hide': this.state.saving})}>Save</span>
                        <span className={classNames({'hide': !this.state.saving})}>Saving ...</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div id="connection-settings" className={classNames({'tab-pane': true, 'active': this.state.showSettings})}>
                  <form className="connection-form form-horizontal" onSubmit={this._saveConnection}>
                    <div id="connectionForm"></div>
                    <div className="modal-footer text-center">
                      <button disabled={this.state.saving} type="submit" className="btn btn-primary save">
                        <span className={classNames({'hide': this.state.saving})}>Save</span>
                        <span className={classNames({'hide': !this.state.saving})}>Saving ...</span>
                      </button>

                      <button disabled={this.state.sharing} href="#" className={classNames({
                        'btn': true,
                        'btn-default': true,
                        'hide': !this.state.showShare
                      })} onClick={this._share}>
                        <i className="icon-budicon-339"></i>
                        <span className={classNames({'hide': this.state.sharing})}>Share</span>
                        <span className={classNames({'hide': !this.state.sharing})}>Sharing ...</span>
                      </button>

                      <button href={this.state.prLocation} target="_blank" className={classNames({
                        'btn': true,
                        'btn-default': true,
                        'hide': !this.state.showPrLocation
                      })}>
                        <i className="icon-budicon-339"></i><span className="text">View PR</span>
                      </button>

                      <button disabled={this.state.deleting} href="#" className={classNames({
                        'btn': true,
                        'btn-link': true,
                        'hide': !this.state.showDelete
                      })} onClick={this._delete}>
                        <i className="icon-budicon-263"></i>
                        <span className={classNames({'hide': this.state.deleting})}>Delete</span>
                        <span className={classNames({'hide': !this.state.deleting})}>Deleting ...</span>
                      </button>
                    </div>
                  </form>
                </div>

                <div id="try" className={classNames({'tab-pane': true, 'active': this.state.showTry})}>
                  <div id="tryForm"></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ConnectionModal;
