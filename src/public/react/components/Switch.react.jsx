var React = require('react');

var ConnectionsStore = require('../stores/ConnectionsStore');

var Switch = React.createClass({
  propTypes: {
    connection: React.PropTypes.object.isRequired,
    onChange:   React.PropTypes.func
  },
  _onChange: function (event) {
    event.stopPropagation();
    this.props.onChange(event.target, this.props.connection);
  },
  componentDidMount: function () {
    ConnectionsStore.addChangeListener(this._onConnectionsChange);
  },
  componentWillUnmount: function () {
    ConnectionsStore.removeChangeListener(this._onConnectionsChange);
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
  },

  _onConnectionsChange: function (connections) {
    $(this.getDOMNode()).find('.uiswitch').prop('checked', this.isActive());
  }
});

module.exports = Switch;
