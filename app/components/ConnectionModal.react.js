var React      = require('react');
var Switch     = require('./Switch.react');
var classNames = require('classnames');

var ConnectionForm = require('./ConnectionForm.react');
var Applications   = require('./Applications.react');

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
      showTryIt:      false,
      connection:     this.props.connection || {strategy:'oauth2', options: {scripts: {
        fetchUserProfile: [
                          'function(accessToken, ctx, cb) {',
                          ' // call oauth2 APIwith the accesstoken and create the profile',
                          ' cb(null, profile);',
                          '}'
                          ].join('\n')
      }}, enabled_clients: undefined},
      title:          this.props.title || 'New Connection',
      mode:           this.props.mode || 'create',
      showPrLocation: false,
      showShare:      this.props.mode === 'edit' ? (this.props.connection.isShared === true ? false : true) : false,
      prLocation:     '#',
      sharing:        false,
      saving:         false
    };
  },

  componentDidMount: function () {
    this.setState({
      connectionForm:   React.render(<ConnectionForm defaultValue={this.state.connection} mode={this.state.mode}/>, document.getElementById('connectionForm')),
      applicationsForm: React.render(<Applications defaultValue={this.state.connection.enabled_clients}/>, document.getElementById('applicationsForm'))
    });
  },

  _close: function() {
    React.unmountComponentAtNode(document.getElementById('connectionModal'));
  },

  _showSettings: function () {
    this.setState({
      showSettings: true,
      showApps:     false
    });
  },

  _showApps: function () {
    this.setState({
      showSettings: false,
      showApps:     true
    });
  },

  _showTryIt: function () {
    this.setState({
      showTryIt: true
    });
  },

  _share: function () {
    var connection = this.state.connectionForm.getConnection();

    this.setState({sharing: true});

    ConnectionsStore.share({
      recipe:  connection.name,
      username:    window.env.username,
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

  _save: function () {
    var clients    = this.state.applicationsForm.getSelectedClients();
    var connection = this.state.connectionForm.getConnection();
    var id         = connection.id;
    var isShared   = connection.isShared;

    connection.enabled_clients = Object.keys(clients);
    delete connection.id;
    delete connection.isShared;

    this.setState({saving: true});

    if (this.state.mode === 'create') {
      ConnectionsStore.create(connection)
        .then(function (connection) {
          this._showSettings();
          this._showTryIt();
          this.setState({
            mode:       'edit',
            title:      connection.name,
            showShare:  isShared ? false : true,
            saving:     false
          });

          if (!isShared) {
            this.state.connectionForm.showInfo();
          }

          this.state.connectionForm.setState({
            mode:         'edit',
            defaultValue: connection,
          });

        }.bind(this));
    }

    if (this.state.mode === 'edit') {
      ConnectionsStore.update(id, connection)
        .then(function () {
          this._showSettings();
          this.state.connectionForm.showSuccessMessage();
          this._showTryIt();
          this.state.connectionForm.setState({
            infoStyle: {display: 'none'}
          });
          this.setState({
            saving: false
          });
        }.bind(this));
    }
  },

  generateTryItUrl: function () {
    // // TODO: Extract to Mixin
    return [
      window.env.userUrl + '?',
      'response_type=code',
      '&scope=openid%20profile',
      '&client_id=' + window.env.masterClientId,
      '&prompt=consent',
      '&connection=' + this.state.connection.name,
      '&redirect_uri=https://manage.auth0.com/tester/callback?connection=' + this.state.connection.name
    ].join('');
  },

  render: function () {
    var hide = this.state.mode === 'create';

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
              </ul>
            </div>
            <div className="tab-content">

                <div id="apps-selector" className={classNames({'tab-pane': true, 'active': this.state.showApps})}>
                  <form className="connection-form form-horizontal">
                    <div id="applicationsForm"></div>
                  </form>
                </div>
                <div id="connection-settings" className={classNames({'tab-pane': true, 'active': this.state.showSettings})}>
                  <form className="connection-form form-horizontal">
                    <div id="connectionForm"></div>
                  </form>
                </div>

                <div className="modal-footer text-center">
                  <button className="btn btn-primary save" onClick={this._save}>
                    <span className={classNames({'hide': this.state.saving})}>Save</span>
                    <span className={classNames({'hide': !this.state.saving})}>Saving ...</span>
                  </button>

                  <a href={this.generateTryItUrl()} target="_blank" className={classNames({'btn': true, 'btn-success': true, 'hide': hide})}>
                    <i className="icon-budicon-187"></i><span className="text">Try</span>
                  </a>
                  <a href="#" className={classNames({
                    'btn': true,
                    'btn-default': true,
                    'hide': !this.state.showShare
                  })} onClick={this._share} disabled={this.state.sharing}>
                    <i className="icon-budicon-339"></i>
                    <span className={classNames({'hide': this.state.sharing})}>Share</span>
                    <span className={classNames({'hide': !this.state.sharing})}>Sharing ...</span>
                  </a>
                  <a href={this.state.prLocation} target="_blank" className={classNames({
                    'btn': true,
                    'btn-default': true,
                    'hide': !this.state.showPrLocation
                  })}>
                    <i className="icon-budicon-339"></i><span className="text">View PR</span>
                  </a>
                </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ConnectionModal;
