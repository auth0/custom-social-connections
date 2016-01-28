var React = require('react');

var CreateButton = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func
  },
  render: function () {
    return (
      <a href="#" id="add-db" className="btn btn-success pull-right new-connection" onClick={this._onClick} style={{cursor: 'pointer'}}>
        <i className="icon-budicon-473"></i>NEW CONNECTION
      </a>
    );
  },

  _onClick: function() {
    this.props.onClick();
  }
});

module.exports = CreateButton;
