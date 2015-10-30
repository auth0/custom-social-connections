var TryIt  = React.createClass({
  componentWillReceiveProps: function(nextProps){
    if (nextProps.connection && nextProps.connection.options) {
      var templateUrl = [
        'https://kyron.auth0.com/authorize?',
        'response_type=code',
        '&client_id=0bETHKnP8vHAHSKnG9sX4DaW14p7QOBr',
        '&connection=' + nextProps.connection.name,
        '&redirect_uri=https://dribbble.com'
      ];

      window.open(templateUrl.join(''));
    }
  },
  render: function() {
    return ( <div /> );
  }
});
