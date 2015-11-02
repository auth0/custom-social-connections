var Verification = React.createClass({
  getInitialState: function() {
    return {
      script: ''
    };
  },
  componentWillMount: function() {
    var queryString = window.location.search || '';
    var that        = this;
    var keyValPairs = [];
    var params      = {};

    queryString = queryString.substr(1);

    if (queryString.length) {
      keyValPairs = queryString.split('&');
      for (var pairNum in keyValPairs) {
        var key = keyValPairs[pairNum].split('=')[0];
        if (!key.length) {
          continue;
        }
        if (typeof params[key] === 'undefined') {
          params[key] = [];
        }
        params[key].push(keyValPairs[pairNum].split('=')[1]);
      }
    }
    var connection = new Connection();

    connection.getTokenInfo(params.code[0], function(data) {
      that.setState({
        script: JSON.stringify(data)
      });
    }, function(err) {
      alert(err);
    });

  },
	render: function() {
		return (
			<div className="container">
				<div className="page-header">
					<h1>Custom OAuth2 Connections - Verification <small>Auth0 Exercise</small></h1>
				</div>
				<div className="row">
				  	<div className="col-md-12">
						<TextEditor  script={ this.state.script || '' }/>
					</div>
				</div>
			</div>
		);
	}
});
