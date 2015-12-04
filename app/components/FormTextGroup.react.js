var React  = require('react');
var FormControlMixin = require('../mixins/FormControlMixin');

var FormTextGroup = React.createClass({
  mixins: [FormControlMixin],
  propTypes: {
    title:        React.PropTypes.string.isRequired,
    placeholder:  React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    readOnly:     React.PropTypes.bool,
    required:     React.PropTypes.bool,
    autoFocus:    React.PropTypes.bool,
    helpText:     React.PropTypes.string
  },
  render: function () {
    return (
      <div className="form-group">
        <label className="col-xs-12 col-sm-4 col-md-3 control-label col-left">{this.props.title}</label>
        <div className="col-xs-12 col-sm-8 col-md-9 col-right">
          <input
            autoFocus={this.props.autoFocus}
            required={this.props.required}
            id={this.props.id}
            name={this.props.id}
            type="text"
            className="form-control"
            placeholder={this.props.placeholder}
            value={this.state.value}
            readOnly={this.props.readOnly}
            onChange={this._handleChange}
          ></input>
          <span className="help-block">{this.props.helpText}</span>
        </div>
      </div>
    );
  }
});

module.exports = FormTextGroup;
