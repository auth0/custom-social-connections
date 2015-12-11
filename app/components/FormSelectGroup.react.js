var React  = require('react');
var FormControlMixin = require('../mixins/FormControlMixin');

var FormSelectGroup = React.createClass({
  mixins: [FormControlMixin],
  propTypes: {
    title:               React.PropTypes.string.isRequired,
    options:             React.PropTypes.array.isRequired,
    defaultValue:        React.PropTypes.string,
    disabled:            React.PropTypes.bool,
    optionsDisableRule:  React.PropTypes.func
  },
  render: function () {
    var isDisabled = this.props.optionsDisableRule || function () { return false; };
    var options    = this.props.options.map(function (option, index) {
      var disabled = isDisabled(option.name);
      return (
        <option value={option.value} disabled={isDisabled(option.name)} key={index}>{option.name}</option>
      );
    }.bind(this));

    return (
      <div className="form-group">
        <label className="control-label col-xs-3">{this.props.title}</label>
        <div className="controls col-xs-9">
          <select
            className="form-control"
            value={this.state.value}
            disabled={this.props.disabled}
            onChange={this._handleChange}>
            {options}
          </select>
        </div>
      </div>
    );
  }
});

module.exports = FormSelectGroup;
