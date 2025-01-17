var React  = require('react');

var FormTextGroup     = require('./FormTextGroup.react');

var AuthParamsMap = React.createClass({
  propTypes: {
    mode:         React.PropTypes.string,
    defaultValue: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      successMessage:   {display: 'none'},
      mode:             this.props.mode,
      defaultValue:     this.props.defaultValue || {}
    };
  },

  showSuccessMessage: function () {
    this.setState({
      successMessage: {}
    });
  },

  getParamMappings: function () {
    var body = {};

    Object.keys(this.refs).map(function (key) {
      var value = this.refs[key].getValue();
      if (value) {
        body[value] = key;
      }
    }.bind(this));

    return body;
  },

  render: function () {
    const fields = ['force_login', 'login_hint', 'whr', 'wauth', 'hd', 'access_type', 'prompt', 'approval_prompt', 'display', 'include_granted_scopes', 'resource'];

    var fieldValues = {};
    Object.keys(this.state.defaultValue).forEach(function (mapping) {
      fieldValues[this.state.defaultValue[mapping]] = mapping;
    }.bind(this));

    var fieldMappings = fields.map(function (field) {
      return (
        <div className="col-xs-6" key={field}>
          <FormTextGroup
            title={field}
            defaultValue={fieldValues[field]}
            required={false}
            ref={field}/>
        </div>
      );
    });

    return (
      <div className="modal-body" style={{paddingTop: '0', paddingBottom: '15px'}}>
        <div className="connection-name form-group">
          <div className="info-area" style={this.state.successMessage}>
            <div className="alert alert-success" role="alert" style={{marginBottom: '0'}}>
              Auth Param settings saved successfully
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row">
            {fieldMappings}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AuthParamsMap;
