var React  = require('react');
var Switch = require('./Switch.react');

var FormControlMixin  = require('../mixins/FormControlMixin');
var FormTextGroup     = require('./FormTextGroup.react');
var FormSelectGroup   = require('./FormSelectGroup.react');
var FormTextAreaGroup = require('./FormTextAreaGroup.react');

var ConnectionForm = React.createClass({
  propTypes: {
    mode:         React.PropTypes.string,
    defaultValue: React.PropTypes.object,
    onShare:      React.PropTypes.func
  },
  getInitialState: function () {
    return {
      infoStyle:      {display: 'none'},
      successMessage: {display: 'none'},
      mode:           this.props.mode,
      defaultValue:   this.props.defaultValue
    };
  },

  getConnection: function () {
    return this._processBody();
  },

  showInfo: function () {
    this.setState({
      infoStyle: {}
    });
  },

  showSuccessMessage: function () {
    this.setState({
      successMessage: {}
    });
  },

  _processBody: function () {
    var body = {};

    Object.keys(this.refs).map(function (key) {
      var props = key.split('.');
      var prev  = props.slice(0, 1);
      var pointer;

      props = props.slice(1, props.length);

      if (typeof body[prev] === 'undefined') {
        body[prev] = {};
      }

      if (props.length === 0) {
        body[prev] = this.refs[key].getValue();
      }

      props.forEach(function (prop, index) {
        if (!pointer) {
          body[prev][prop] = {};
        } else {
          pointer[prop] = {};
        }

        if (index === props.length -1 && !pointer) {
          body[prev][prop] = this.refs[key].getValue();
        } else if(!pointer) {
          pointer = body[prev][prop];
        } else if (index === props.length -1 && pointer) {
          pointer[prop] = this.refs[key].getValue();
        } else {
          pointer = pointer[prop];
        }

        prev = prop;
      }.bind(this));
    }.bind(this));

    if (this.state.mode === '_update') {
      body.id = this.state.defaultValue.id;
    }

    if (this.state.mode === '_create') {
      body.strategy = 'oauth2';
    }

    body.isShared = this.state.defaultValue.isShared;

    return body;
  },
  render: function () {
    return (
      <div className="modal-body" style={{paddingTop: '0', paddingBottom: '15px'}}>
        <div className="connection-name form-group">
          <div className="info-area" style={this.state.infoStyle}>
            <div className="alert alert-success" role="alert" style={{marginBottom: '0'}}>
              <i className="confetti-ball"></i> Looks like you created your own custom connection. The Auth0 community will be happy.
              You can share your creation by clicking on <strong><a href="#" onClick={this.props.onShare}>Share</a></strong>.
            </div>
          </div>

          <div className="info-area" style={this.state.successMessage}>
            <div className="alert alert-success" role="alert" style={{marginBottom: '0'}}>
              Connection settings saved successfully
            </div>
          </div>
        </div>

        <FormTextGroup
          title="Name"
          placeholder="The name of the connection"
          defaultValue={this.state.defaultValue.name}
          readOnly={this.state.mode === '_update'}
          required={true}
          autoFocus={this.state.mode === '_create' ? true : false}
          ref="name"/>

        <FormTextGroup
          title="Strategy"
          defaultValue={this.state.defaultValue.strategy}
          readOnly={true}/>

        <div className="authentication_area">
          <FormTextGroup
            title="Client ID"
            placeholder="Client ID"
            defaultValue={this.state.defaultValue.options.client_id}
            autoFocus={this.state.mode === '_update' ? true : false}
            ref="options.client_id"/>

          <FormTextGroup
            title="Client Secret"
            placeholder="Client Secret"
            defaultValue={this.state.defaultValue.options.client_secret}
            ref="options.client_secret"/>

          <FormTextGroup
            title="Authorization URL"
            placeholder="Authorization URL"
            defaultValue={this.state.defaultValue.options.authorizationURL}
            ref="options.authorizationURL"/>

          <FormTextGroup
            title="Token URL"
            placeholder="Token URL"
            defaultValue={this.state.defaultValue.options.tokenURL}
            ref="options.tokenURL"/>

          <FormTextGroup
            title="Scope"
            placeholder="scope"
            defaultValue={this.state.defaultValue.options.scope}
            ref="options.scope"/>

          <FormTextAreaGroup
            title="Fetch User Profile Script"
            defaultValue={this.state.defaultValue.options.scripts.fetchUserProfile}
            ref="options.scripts.fetchUserProfile"/>
        </div>
      </div>
    );
  }
});

module.exports = ConnectionForm;
