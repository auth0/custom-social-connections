var TryIt  = React.createClass({
  propTypes: {
    context: React.PropTypes.object
  },
  getInitialState: function() {
    return {
      context: window.context
    };
  },
  componentWillReceiveProps: function(nextProps){
    if (nextProps.connection && nextProps.connection.options) {
      var templateUrl = [
        this.state.context.baseUri + 'authorize?',
        'response_type=code',
        '&scope=openid%20profile',
        '&client_id='+this.state.context.clientId,
        '&prompt=consent',
        '&redirect_uri=https://manage.auth0.com/tester/callback?connection='+ nextProps.connection.name,
        '&connection=' + nextProps.connection.name
      ];

      window.open(templateUrl.join(''));
    }
  },
  render: function() {
    return ( <div /> );
  }
});
