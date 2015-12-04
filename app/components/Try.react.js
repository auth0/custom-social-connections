var React = require('react');

var ClientsStore = require('../stores/ClientsStore');

var FormSelectGroup   = require('./FormSelectGroup.react');

var Try = React.createClass({
  propTypes: {
    clientIds:  React.PropTypes.array,
    connection: React.PropTypes.object,
    mode:       React.PropTypes.string
  },
  getInitialState: function () {
    return {
      clientIds:      this.props.clientIds || [],
      connection:     this.props.connection,
      enabledClients: [],
      modes:          [{name: 'code', value: 'code'}, {name: 'codes', value: 'codes'}],
      mode:           this.props.mode
    };
  },
  _generateTryItUrl: function () {
    return [
      window.env.userUrl + '?',
      'response_type=code',
      '&scope=openid%20profile',
      '&client_id=' + this.refs.application.getValue(),
      '&connection=' + this.state.connection.name,
      '&redirect_uri=https://manage.auth0.com/tester/callback?connection=' + this.state.connection.name
    ].join('');
  },

  _onClick: function () {
    window.open(this._generateTryItUrl(), '_blank');
  },

  _onClientsChange: function (clients) {
    var enabledClients = [];
    var clientIds      = this.state.clientIds;

    clients.forEach(function (client) {
      if (clientIds.indexOf(client.client_id) >= 0) {
        enabledClients.push({name: client.name, value: client.client_id});
      }
    }.bind(this));

    this.setState({
      enabledClients: enabledClients
    });
  },

  componentDidMount: function () {
    ClientsStore.getAll();
    ClientsStore.addChangeListener(this._onClientsChange);
  },

  componentWillUnmount: function () {
    ClientsStore.removeChangeListener(this._onClientsChange);
  },

  render: function () {
    return (
      <form className="connection-form form-horizontal">
        <div className="modal-body" style={{paddingTop: '0', paddingBottom: '15px'}}>
          <div className="connection-name form-group">
            <div className="info-area" style={this.state.mode === '_create' ? {} : {display: 'none'}}>
              <div className="alert alert-info" role="alert" style={{marginBottom: '0'}}>
                You need to enable one application at least in order to be able to try this connection.
              </div>
            </div>
          </div>

          <fieldset disabled={this.state.mode === '_create'}>
            <div>
              <div className="form-group">
                <p className="col-xs-12" style={{marginTop: 0}}>Try this connection by specifying an application and a recipient.</p>
              </div>
              <div className="form-group">
                <FormSelectGroup
                    title="Application"
                    options={this.state.enabledClients}
                    defaultValue={this.state.clientIds.slice(0,1).shift()}
                    ref="application"/>
              </div>

              <div className="form-group">
                <FormSelectGroup
                    title="Mode"
                    options={this.state.modes}
                    disabled={true}
                    />
              </div>
            </div>
          </fieldset>
        </div>
        <div className="modal-footer text-center">
          <fieldset disabled={this.state.mode === '_create'}>
            <button className="btn btn-success" onClick={this._onClick}>
             <i className="icon-budicon-187"></i>
             <span className="text">Try</span>
            </button>
          </fieldset>
        </div>
      </form>
    );
  }
});

module.exports = Try;
