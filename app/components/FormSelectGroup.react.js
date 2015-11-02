var React  = require('react');
var FormControlMixin = require('../mixins/FormControlMixin');

var FormSelectGroup = React.createClass({
  mixins: [FormControlMixin],
  propTypes: {
    title:        React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string.isRequired,
    options:      React.PropTypes.array.isRequired,
    readOnly:     React.PropTypes.bool
  },
  render: function () {
    var options = this.props.options.map(function (option, index) {
      return (
        <option value={option.value} key={index}>{option.name}</option>
      );
    });

    return (
      <div className="form-group">
        <label className="control-label col-xs-3">{this.props.title}</label>
        <div className="controls col-xs-9">
          <select
            className="form-control"
            value={this.state.value}
            readOnly={this.props.readOnly}
            onChange={this._handleChange}>
            {options}
          </select>
        </div>
      </div>
    );
  }
});

module.exports = FormSelectGroup;
