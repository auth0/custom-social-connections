var React = require('react');

var Switch = React.createClass({
  propTypes: {
    connection: React.PropTypes.object.isRequired,
    onChange:   React.PropTypes.func
  },
  _onChange: function (event) {
    event.stopPropagation();
    this.props.onChange(event.target.checked, this.props.connection);
  },
  isActive: function () {
    // TODO: Extract to Mixin
    return typeof this.props.connection.enabled_clients !== 'undefined' && this.props.connection.enabled_clients.length > 0;
  },
  render: function () {
    return (
      <div className="switch-animate">
        <div className="switch-animate">
          <input type="checkbox" className="uiswitch" defaultChecked={this.isActive()} name="status" onChange={this._onChange}></input>
          <span className="switch-left switch-small">ON</span>
          <label className="switch-small">&nbsp;</label>
          <span className="switch-right switch-small">OFF</span>
        </div>
        <span className="switch-left"></span>
      </div>
    );
  }
});

module.exports = Switch;
