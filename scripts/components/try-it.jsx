var TryIt  = React.createClass({
    componentWillReceiveProps: function(nextProps){
        if (nextProps.connection && nextProps.connection.options) {
            //var templateUrl = nextProps.connection.options.authorizationURL + "?client_id=" + nextProps.connection.options.client_id + "&response_type=code&redirect_uri=" + window.location.toString() + "callback";  
            var templateUrl = "https://mcastany.auth0.com/authorize?client_id=fUany5j9QpMUPDnbtAoa4nlV8V1C2pUS&response_type=code&connection=" + nextProps.connection.name + "&redirect_uri=https://manage.auth0.com/tester/callback";
            window.open(templateUrl);
        }
    },
    
    render: function() {
        return ( <div /> );
    }
});


