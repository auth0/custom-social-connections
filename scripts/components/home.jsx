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
		var connection = new Connection();
		connection.getAll(
			function(data) {that.setState({connections: data});}, 
			function(xhr, err, st){console.log(err);}
		);
	},
	onRowSelected : function(id){
		this.setState({
			selectedConnection: this.state.connections.filter(function(el){ return el.id === id})[0],
			editMode : false
		});
		$(this.refs.modal.getDOMNode()).modal(); 
	},
	onEdit: function(id){
		var selectedConnection = this.state.connections.filter(function(el){ return el.id === id})[0];
		this.setState({ selectedConnection: selectedConnection, editMode : true });
		$(this.refs.modal.getDOMNode()).modal(); 
	},
	onAddComplete: function(connection){
		this.setState({
			connections : this.state.connections.push(connection),
			editMode : false,
			selectedConnection : null
		});
	},
	onSaveComplete: function(id, updatedConnection){
		$(this.refs.modal.getDOMNode()).modal('hide'); 		
		this.setState({
			connections : this.state.connections.map(function(connection){
				if (connection.id === id){
					connection = updatedConnection;
				}
				
				return connection
			}),
			editMode : false,
			selectedConnection : null
		});
	},
	onDeleteComplete: function(name){
		$(this.refs.modal.getDOMNode()).modal('hide'); 				
		this.setState({
			connections : this.state.connections.filter(function(connection){ return connection.id !== id; }),
			editMode : false,
			selectedConnection : null
		});
	},
	close: function(){
		$(this.refs.modal.getDOMNode()).modal('hide'); 		
		this.setState({editMode : false, selectedConnection : null});
	},
	render: function() {
		var that = this;	
		var rows = this.state.connections.map(function (connection) {
			return ( <AuthConnectionRow  
						selected={that.onRowSelected}
						edit={that.onEdit}
						remove={that.onDeleteComplete}
						id={connection.id}
						name={connection.name} 
						strategy={connection.strategy} />);
		});

		var showTemplate = ( <PreviewConnection selectedConnection={this.state.selectedConnection} closeHandler={this.close} />),
			header = (this.state.selectedConnection ? this.state.selectedConnection.name : '') + 'Custom OAuth2 Connection';
		if (this.state.editMode){
			showTemplate = (<EditConnection selectedConnection={this.state.selectedConnection} closeHandler={this.close} onSaveComplete={this.onSaveComplete} />);
		}
		
		return (
			<div className="container">
				<div className="page-header">
					<h1>Custom OAuth2 Connections <small>Auth0 Exercise</small></h1>
				</div>
				<div className="row">
				  	<div className="col-md-12">
						<table className="table table-striped">
						<thead><tr>
							<th>Strategy</th>
							<th>Name</th>
							<th></th>
						</tr></thead>
						<tbody>{rows}</tbody>
						</table>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<button className="btn btn-primary" >Add</button>
					</div>
				</div>
				<Modal ref="modal"
						header={header}
						body={showTemplate}
					/>
			</div>
		);
	}
})