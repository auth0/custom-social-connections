var React = require('react');
var Board = require('./Board.react');

var ConnectionsStore = require('../stores/ConnectionsStore');
var TemplatesStore   = require('../stores/TemplatesStore');

var Switchboard = React.createClass({
  propTypes: {
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
    TemplatesStore.getAll();
    TemplatesStore.addChangeListener(this._onTemplatesChange);
    ConnectionsStore.addChangeListener(this._onConnectionsChange);
  },
  componentWillUnmount: function () {
    TemplatesStore.removeChangeListener(this._onTemplatesChange);
    ConnectionsStore.removeChangeListener(this._onConnectionsChange);
  },
  _onTemplatesChange: function (templates) {
    ConnectionsStore.getAll();
    this.setState({
      templates: templates
    });
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
    var templates = this.state.templates;
    var source = templates.slice(0, templates.length);

    templates.forEach(function (template) {
      template.isTemplate = true;
      template.isShared   = true;
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
