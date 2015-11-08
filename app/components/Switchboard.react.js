var React = require('react');
var Board = require('./Board.react');

var ConnectionsStore = require('../stores/ConnectionsStore');

var Switchboard = React.createClass({
  propTypes: {
    templates: React.PropTypes.array.isRequired,
    onChange:  React.PropTypes.func,
    onClick:   React.PropTypes.func
  },
  getInitialState: function () {
    return {
      source: [],
      appAuth: {}
    };
  },
  componentDidMount: function () {
    ConnectionsStore.getAll();
    ConnectionsStore.addChangeListener(this._onConnectionsChange);
  },
  componentWillUnmount: function () {
    ConnectionsStore.removeChangeListener(this._onConnectionsChange);
  },
  render: function () {
    var boards = this.state.source.map(function (connection, index) {
      return (
        <Board connection={connection} key={index} onChange={this.props.onChange} onClick={this.props.onClick}/>
      );
    }.bind(this));

    return (
      <div className="switchboard">
        {boards}
      </div>
    );
  },
  _onConnectionsChange: function (connections) {
    var templates = this.props.templates;
    var source = templates.slice(0, templates.length);

    templates.forEach(function (template) {
      template.isTemplate = true;
    });

    if (connections) {
      connections.forEach(function (connection) {
        var flag = true;

        for (var i = 0; i < source.length; i++) {
          if (source[i].name === connection.name) {
            source[i]            = connection;
            source[i].isTemplate = false;
            source[i].isShared   = true;
            flag                 = false;
            break;
          }
        }

        if (flag) {
          source.push(connection);
        }
      });
    }

    this.setState({
      source: source
    });
  }
});

module.exports = Switchboard;
