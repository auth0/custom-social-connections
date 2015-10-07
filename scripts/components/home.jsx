var Home = React.createClass({ 
	getInitialState: function() {
		return { 
			connections: this.props.connections || [],
			selectedState: null,
			editMode : false
		};
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
	onRowSelected : function(name){
		this.setState({
			selectedConnection: this.state.connections.filter(function(el){ return el.name === name})[0],
			editMode : false
		});
	},
	onEdit: function(name){
		this.setState({
			selectedConnection: this.state.connections.filter(function(el){ return el.name === name})[0],
			editMode : true
		});
	},
	onSaveComplete: function(oldName, updatedConnection){
		var self = this;
		this.setState({
			connections : this.state.connections.map(function(connection){
				if (connection.name === oldName){
					connection = updatedConnection;
				}
				
				return connection
			}),
			editMode : false,
			selectedConnection : null
		});
	},
	onDelete: function(name){
	
	},
	render: function() {
		var that = this;	
		var rows = this.state.connections.map(function (connection) {
			return ( <AuthConnectionRow  
						selected={that.onRowSelected}
						edit={that.onEdit}
						remove={that.onDelete}
						name={connection.name} 
						strategy={connection.strategy} />);
		});

		var showTemplate = ( <PreviewConnection selectedConnection={this.state.selectedConnection} />);
		if (this.state.editMode){
			showTemplate = (<EditConnection selectedConnection={this.state.selectedConnection} onSaveComplete={this.onSaveComplete} />);
		}
		
		return (
			<div className="container">
				<div className="row">
				  	<div className="col-md-8 col-md-offset-2">
						<table className="table table-striped">
						<thead><tr>
							<th>Strategy</th>
							<th>Name</th>
							<th>Actions</th>
						</tr></thead>
						<tbody>{rows}</tbody>
						</table>
					</div>
				</div>
				<div className="row">
					<div className="col-md-8 col-md-offset-2">
						{showTemplate}
					</div>
				</div>
			</div>
		);
	}
})