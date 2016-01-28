var React = require('react');

var Switchboard     = require('./Switchboard.react');
var CreateButton    = require('./CreateButton.react');
var ConnectionModal = require('./ConnectionModal.react');

var ConnectionsStore = require('../stores/ConnectionsStore');
var TemplatesStore   = require('../stores/TemplatesStore');

var ConnectionsApp = React.createClass({
  getInitialState: function () {
    return {
      showErrorMessage: {display: 'none'},
      errorMessage:     'Oops! There was an error. Try again later.',
    };
  },
  componentDidMount: function () {
    TemplatesStore.addErrorListener(this._onError);
    ConnectionsStore.addErrorListener(this._onError);
  },
  componentWillUnmount: function () {
    TemplatesStore.addErrorListener(this._onError);
    ConnectionsStore.addErrorListener(this._onError);
  },
  render: function () {
    return (
      <div className="col-xs-12 wrapper">
        <section id="connections-social" className="content-page current">
          <div className="content-header">
            <h1>Custom Social Connections</h1>
            <CreateButton onClick={this._showModal}/>
            <p className="explanation">
              <i className="icon-info-sign"></i>
              <span>Authenticate users with custom providers. You can control which permissions and attributes to request from each provider.</span>
            </p>
          </div>
          <div className="info-area" style={this.state.showErrorMessage}>
            <div className="alert alert-danger" role="alert" style={{marginBottom: '0'}}>
              {this.state.errorMessage}
            </div>
          </div>
        </section>
        <section>
          <div className="main-loading-container">
            <div className="spin-container loading-spin  ">
              <div className="spinner-css small">
                <span className="side sp_left">
                  <span className="fill"></span>
                </span>
                <span className="side sp_right">
                  <span className="fill"></span>
                </span>
              </div>
            </div>
          </div>
          <Switchboard onChange={this._onChange} onClick={this._onClick}/>
        </section>

        <div className="col-xs-10 wrapper">
          <div id="connectionModal"></div>
        </div>
      </div>
    );
  },

  _showModal: function() {
    React.render(<ConnectionModal/>, document.getElementById('connectionModal'));
  },

  _renderConnectionModal: function (connection, dependency) {
    var mode  = connection.isConfigured ? '_update' : '_create';
    var title = connection.isConfigured ? connection.name : null;

    React.render(<ConnectionModal title={title} connection={connection} mode={mode} dependency={dependency}/>, document.getElementById('connectionModal'));
  },

  _onClick: function (connection) {
    this._renderConnectionModal(connection);
  },

  _onChange: function (target, connection) {
    if (target.checked === true) {
      this._renderConnectionModal(connection, target);
    }

    // Remove enabled connections
    if (target.checked === false) {
      var conn =  {enabled_clients: []};
      var id   = connection.id;

      ConnectionsStore.update(id, conn);
    }
  },

  _onError: function () {
    this.setState({
      showErrorMessage: {}
    });

    window.sessionStorage.removeItem('token');
  }
});

module.exports = ConnectionsApp;
