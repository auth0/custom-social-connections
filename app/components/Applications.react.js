var React  = require('react');
var Switch = require('./Switch.react');

var ClientsStore = require('../stores/ClientsStore');

var Applications = React.createClass({
  propTypes: {
    defaultValue: React.PropTypes.array
  },
  getInitialState: function () {
    var selectedClients = {};

    if (this.props.defaultValue) {
      this.props.defaultValue.map(function (clientId) {
        selectedClients[clientId] = true;
      });
    }

    return {
      clients: [],
      selectedClients: selectedClients,
      successMessage: {display: 'none'}
    };
  },

  showSuccessMessage: function () {
    this.setState({
      successMessage: {}
    });
  },

  isChecked: function (clientId) {
    return typeof this.props.defaultValue === 'undefined' || this.props.defaultValue.indexOf(clientId) >= 0;
  },

  componentDidMount: function () {
    ClientsStore.getAll();
    ClientsStore.addChangeListener(this._onClientsChange);
  },

  componentWillUnmount: function () {
    ClientsStore.removeChangeListener(this._onClientsChange);
  },

  getSelectedClients: function () {
    return this.state.selectedClients;
  },

  render: function () {
    var apps = this.state.clients.map(function (client, index) {
      return (
        <div className="form-group" key={index}>
          <label className="col-xs-10">
            {client.name}
            <p className="help-block">App / API</p>
          </label>
          <div className="col-xs-2 text-right">
            <div className="switch switch-small pull-right has-switch">
              <div className="switch-animate">
                <input type="checkbox" defaultChecked={this.isChecked(client.client_id)} className="uiswitch" onChange={this._onChange} value={client.client_id}></input>
                <span className="switch-right"></span>
              </div>
            </div>
          </div>
        </div>
      );
    }.bind(this));

    return (
      <div className="apps-selector-container">
        <div className="modal-body" style={{paddingTop: '0', paddingBottom: '15px'}}>
          <div className="connection-name form-group">
            <div className="info-area" style={this.state.successMessage}>
              <div className="alert alert-success" role="alert" style={{marginBottom: '0'}}>
                Apps configuration saved successfully
              </div>
            </div>
          </div>
          <div className="client-list">
            {apps}
          </div>
        </div>
      </div>
    );
  },

  _onClientsChange: function (clients) {
    this.setState({
      clients: clients
    });

    if (typeof this.props.defaultValue === 'undefined') {
      var selectedClients = {};

      clients.forEach(function (client) {
        selectedClients[client.client_id] = true;
      });

      this.setState({
        selectedClients: selectedClients
      });
    }
  },

  _onChange: function (event) {
    var key = event.target.value;
    var selectedClients = this.state.selectedClients;

    if (event.target.checked) {
      selectedClients[key] = true;
    } else {
      delete selectedClients[key];
    }

    this.setState({
      selectedClients: selectedClients
    });
  }
});

module.exports = Applications;
