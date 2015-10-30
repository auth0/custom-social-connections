var TryIt  = React.createClass({
  componentWillReceiveProps: function(nextProps){
    if (nextProps.connection && nextProps.connection.options) {
      var templateUrl = [
        'https://kyron.auth0.com/authorize?',
        'response_type=token',
        '&scope=openid%20profile',
        '&client_id=0bETHKnP8vHAHSKnG9sX4DaW14p7QOBr',
        '&redirect_uri=http://jwt.io',
        '&connection=' + nextProps.connection.name
      ];

      window.open(templateUrl.join(''));
    }
  },
  render: function() {
    return ( <div /> );
  }
});
