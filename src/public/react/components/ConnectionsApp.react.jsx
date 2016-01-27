var React = require('react');

var Switchboard     = require('./Switchboard.react');
var CreateButton    = require('./CreateButton.react');
var ConnectionModal = require('./ConnectionModal.react');

var ConnectionsStore = require('../stores/ConnectionsStore');

var ConnectionsApp = React.createClass({
  render: function () {
    return (
      <div className="col-xs-12 wrapper">
        <section id="connections-social" data-route="/connections/custom" data-title="Custom Connections " className="content-page current">
          <div className="content-header">
            <h1>Custom Social Connections</h1>
            <CreateButton onClick={this._showModal}/>
            <p className="explanation">
              <i className="icon-info-sign"></i>
              <span>Authenticate users with custom providers. You can control which permissions and attributes to request from each provider.</span>
            </p>
          </div>
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
  }
});

module.exports = ConnectionsApp;
