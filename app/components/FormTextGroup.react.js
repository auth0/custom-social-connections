var React  = require('react');
var FormControlMixin = require('../mixins/FormControlMixin');

var FormTextGroup = React.createClass({
  mixins: [FormControlMixin],
  propTypes: {
    title:        React.PropTypes.string.isRequired,
    placeholder:  React.PropTypes.string,
    defaultValue: React.PropTypes.string,
    readOnly:     React.PropTypes.bool,
    required:     React.PropTypes.bool
  },
  render: function () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-3">{this.props.title}</label>
        <div className="controls col-xs-9">
          <input
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
        </div>
      </div>
    );
  }
});

module.exports = FormTextGroup;
