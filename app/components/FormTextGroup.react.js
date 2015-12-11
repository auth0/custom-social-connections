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
    helpText:     React.PropTypes.string,
    display:      React.PropTypes.string
  },
  render: function () {
    return (
      <div className="form-group" style={{display: this.props.display}}>
        <div className="row">
          <label className="control-label col-xs-12">{this.props.title}</label>
        </div>

        <div className="row">
          <div className="controlls col-xs-12">
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
      </div>
    );
  }
});

module.exports = FormTextGroup;
