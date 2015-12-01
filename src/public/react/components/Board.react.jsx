var React  = require('react');
var Switch = require('./Switch.react');
var classNames = require('classnames');

var Board = React.createClass({
  propTypes: {
    connection: React.PropTypes.object.isRequired,
    onChange:   React.PropTypes.func,
    onClick:    React.PropTypes.func
  },
  isActive: function () {
    // TODO: Extract to Mixin
    return typeof this.props.connection.enabled_clients !== 'undefined' && this.props.connection.enabled_clients.length > 0;
  },
  render: function () {
    return (
      <div className={classNames({
          'switchboard-item': true,
          'col-xs-4': true,
          disabled: !this.isActive()
        })}
        tabIndex="-1">
        <div className="provider-name" onClick={this._onClick}>
          {this.props.connection.name}
        </div>
        <div className="switch-title hide" style={{display: 'block'}}>
          {this.props.connection.name}
        </div>
        <div className="switch switch-small has-switch pull-right connection-status">
          <Switch connection={this.props.connection} onChange={this.props.onChange}/>
        </div>
      </div>
    );
  },
  _onClick: function () {
    this.props.onClick(this.props.connection);
  }
});

module.exports = Board;
