var Home = React.createClass({ 
	getInitialState: function() {
		return { connections: this.props.connections || []};
	},
	componentWillMount: function() {
		var that = this;
		$.ajax({
			url: AUTH_CONNECTION_API,
			type:"GET",
			contentType: 'application/json',
			beforeSend : function(xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + AUTH_TOKEN);
		}})
		.done(function(data) {
			that.setState({connections: data});
		})
		.fail(function(xhr, err, st){
			console.log(err);
		});
	},
	render: function() {
		var rows = this.state.connections.map(function (connection) {
			return ( <AuthConnectionRow name={connection.name} strategy={connection.strategy} content=""></AuthConnectionRow>);
		});
		return (
			
			<div className="container">
				<div className="row">
				  	<div className="col-md-8 col-md-offset-2">
						<table className="table table-striped">
						<thead><tr>
							<th>Strategy</th>
							<th>Name</th>
						</tr></thead>
						<tbody>{rows}</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
})