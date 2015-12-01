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
      value: beautify(this.props.defaultValue||'', { indent_size: 2 }) || ''
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
      mode:        'javascript',
      tabSize:     2,
      lineNumbers: true
    };

    return (
      <div className="form-group">
        <div className="row">
          <label className="control-label col-xs-12">{this.props.title}</label>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Codemirror value={this.state.value} onChange={this._onChanged} options={options} className="form-control"/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = FormTextAreaGroup;
