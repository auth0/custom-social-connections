var React            = require('react');
var FormControlMixin = require('../mixins/FormControlMixin');
var Codemirror       = require('react-codemirror');
var beautify         = require('js-beautify').js_beautify;

require('codemirror/mode/javascript/javascript');

var FormTextAreaGroup = React.createClass({
  propTypes: {
    title:        React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      value: beautify(this.props.defaultValue, { indent_size: 2 }) || ''
    };
  },
  getValue: function () {
    return this.state.value;
  },
  _onChanged: function (updatedValue) {
    this.setState({value: updatedValue});
  },
  render: function () {
    var options = {
      mode:    'javascript',
      tabSize: 2
    };

    return (
      <div className="form-group">
        <label className="control-label col-xs-3">{this.props.title}</label>
        <div className="controls col-xs-9">
          <Codemirror value={this.state.value} onChange={this._onChanged} options={options} className="form-control"/>
        </div>
      </div>
    );
  }
});

module.exports = FormTextAreaGroup;
