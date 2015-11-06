var React  = require('react');
var FormControlMixin = require('../mixins/FormControlMixin');

var FormTextAreaGroup = React.createClass({
  mixins: [FormControlMixin],
  propTypes: {
    title:        React.PropTypes.string.isRequired,
    defaultValue: React.PropTypes.string
  },
  render: function () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-3">{this.props.title}</label>
        <div className="controls col-xs-9">
          <textarea rows="5" defaultValue={this.props.defaultValue} className="form-control" style={{resize: 'none'}} onChange={this._handleChange}></textarea>
        </div>
      </div>
    );
  }
});

module.exports = FormTextAreaGroup;
