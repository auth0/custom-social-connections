var React      = require('react');
var Switch     = require('./Switch.react');
var classNames = require('classnames');

var ConnectionForm = require('./ConnectionForm.react');
var Applications   = require('./Applications.react');
var Try            = require('./Try.react');

var OperationsMixin = require('../mixins/OperationsMixin');

var ConnectionModal = React.createClass({
  mixins: [OperationsMixin],
  propTypes: {
    title: React.PropTypes.string,
    mode:  React.PropTypes.string
  },
  getInitialState: function () {
    return {
      showSettings:   true,
      showApps:       false,
      showTry:        this.props.mode === '_update' ? (window.env.userUrl ? true : false) : false,
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
      saved:          false,
      updated:        false,
      deleting:       false,
    };
  },

  componentDidMount: function () {
    if (this.props.dependency && this.props.dependency.checked === true) {
      this.state.connection.enabled_clients = undefined;
    }

    this.setState({
      connectionForm:   React.render(<ConnectionForm onShare={this._share} defaultValue={this.state.connection} mode={this.state.mode}/>, document.getElementById('connectionForm')),
      applicationsForm: React.render(<Applications mode={this.state.mode} defaultValue={this.state.connection.enabled_clients}/>, document.getElementById('applicationsForm')),
    });
  },

  _close: function() {
    if (this.props.dependency && !this.state.saved) {
      this.props.dependency.checked = false;
    }

    React.unmountComponentAtNode(document.getElementById('connectionModal'));
  },

  _showMe: function (active) {
    var tabs = {
      showSettings: false,
      showApps:     false
    };

    tabs[active] = true;

    this.setState(tabs);
  },

  _saveApplications: function (e) {
    e.preventDefault();
    this._save(this.state.applicationsForm);
  },

  _saveConnection: function (e) {
    e.preventDefault();
    this._save(this.state.connectionForm);
  },

  _generateTryItUrl: function () {
    return [
      window.env.userUrl + '?',
      'response_type=code',
      '&scope=openid%20profile',
      '&client_id=' + window.env.masterClientId,
      '&connection=' + this.state.connection.name,
      '&redirect_uri=https://manage.auth0.com/tester/callback?connection=' + this.state.connection.name
    ].join('');
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
        <div className="modal-dialog modal-lg">
          <div className="modal-content" id="new-connection-tab-content">
            <div className="modal-header">
              <button onClick={this._close} type="button" className="close"><span aria-hidden="true">×</span><span className="sr-only">Close</span></button>
              <h4 className="modal-title" style={{textTransform: 'capitalize'}}>{this.state.title}</h4>
            </div>
            <div className="form-wrapper">
              <ul className="nav nav-tabs">
                <li className={classNames({'active': this.state.showSettings})}><a href="#" onClick={this._showMe.bind(this, 'showSettings')}>Settings</a></li>
                <li className={classNames({'active': this.state.showApps})}><a href="#"     onClick={this._showMe.bind(this, 'showApps')}>Apps</a></li>
              </ul>
            </div>
            <div className="tab-content">
                <div id="connection-settings" className={classNames({'tab-pane': true, 'active': this.state.showSettings})}>
                  <form className="connection-form form" onSubmit={this._saveConnection}>
                    <div id="connectionForm"></div>
                    <div className="modal-footer text-center">
                      <button disabled={this.state.saving} type="submit" className="btn btn-primary save">
                        <span className={classNames({'hide': this.state.saving})}>Save</span>
                        <span className={classNames({'hide': !this.state.saving})}>Saving ...</span>
                      </button>

                      <a href={this._generateTryItUrl()} target="_blank" className={classNames({
                        'btn': true,
                        'btn-success': true,
                        'hide': !this.state.showTry
                      })}>
                        <span className="text">Try</span>
                      </a>

                      <button disabled={this.state.deleting} href="#" className={classNames({
                        'btn': true,
                        'btn-danger': true,
                        'hide': !this.state.showDelete
                      })} onClick={this._delete}>
                        <span className={classNames({'hide': this.state.deleting})}>Delete</span>
                        <span className={classNames({'hide': !this.state.deleting})}>Deleting ...</span>
                      </button>

                      <button disabled={this.state.sharing} href="#" className={classNames({
                        'btn': true,
                        'btn-default': true,
                        'hide': !this.state.showShare
                      })} onClick={this._share}>
                        <span className={classNames({'hide': this.state.sharing})}>Share</span>
                        <span className={classNames({'hide': !this.state.sharing})}>Sharing ...</span>
                      </button>

                      <a href={this.state.prLocation} target="_blank" className={classNames({
                        'btn': true,
                        'btn-default': true,
                        'hide': !this.state.showPrLocation
                      })}>
                        <span className="text">View PR</span>
                      </a>
                    </div>
                  </form>
                </div>

                <div id="apps-selector" className={classNames({'tab-pane': true, 'active': this.state.showApps})}>
                  <form className="connection-form form-horizontal" onSubmit={this._saveApplications}>
                    <div id="applicationsForm"></div>
                    <fieldset disabled={this.state.mode === '_create'}>
                      <div className="modal-footer text-center">
                        <button type="submit" className="btn btn-primary save">
                          <span className={classNames({'hide': this.state.saving})}>Save</span>
                          <span className={classNames({'hide': !this.state.saving})}>Saving ...</span>
                        </button>
                      </div>
                    </fieldset>
                  </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ConnectionModal;
