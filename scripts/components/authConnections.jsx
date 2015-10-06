var AuthConnectionRow  = React.createClass({
    propTypes: {
        strategy: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired
    },
    render: function() {
        return (
            <tr>
              <td width="50%">
                  { this.props.strategy }
              </td>
              <td width="40%">
                  { this.props.name }
              </td>
              <td width="10%">
                  { this.props.content }
              </td>
          </tr>
      );
    }
});
