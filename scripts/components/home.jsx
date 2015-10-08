var Home = React.createClass({ 
	getInitialState: function() {
		return { 
			connections: this.props.connections || [],
			selectedConnection: { },
			dialogBody : 'info'
		};
	},
	componentWillMount: function() {
		var connection = new Connection(),
			onComplete = function(data) { this.setState({connections: data});},
			onError = function(xhr, err, st){console.log(err);};
		connection.getAll(onComplete.bind(this), onError.bind(this));
	},
	openModal: function(id, type){
		this.setState({
			selectedConnection: this.getConnection(id) || {},
			dialogBody : type
		});
		$(this.refs.modal.getDOMNode()).modal();
	},
	closeModal: function(){
		$(this.refs.modal.getDOMNode()).modal('hide'); 		
		this.setState({dialogBody : 'info', selectedConnection : {}});
	},
	onSaveComplete: function(connection){
		this.closeModal();
		this.setState({ connections : this.addOrUpdateConnectionList(connection) });
	},
	onDeleteComplete: function(id){
		var connection = new Connection(),
			onComplete = function(){
				this.closeModal(); 				
				this.setState({ connections : this.removeConnection(id) });
			};
		connection.delete(id, onComplete.bind(this));
	},
	onAddClick: function() {
		this.openModal(null, 'form');	
	},
	getConnection: function(id){
		return this.state.connections.filter(function(el){ return el.id === id})[0]
	},
	addOrUpdateConnectionList: function(connection){
		var found = false,
			updateList = [];
		for(var i = 0; i < this.state.connections.length; i++){
			if (connection.id === this.state.connections[i].id){
				found = true;
				this.state.connections[i] = connection;
			} 
		}
		
		if (!found){
			this.state.connections.push(connection);
		}
		
		return this.state.connections;
	},
	removeConnection: function(id){
		return this.state.connections.filter(function(connection){ return connection.id !== id; })
	},
	render: function() {
		var that = this,
			header = (this.state.selectedConnection.name || '') + ' Custom OAuth2 Connection',
			rows = this.state.connections.map(function (connection) {
				return ( <AuthConnectionRow key={connection.id} openDialog={that.openModal} id={connection.id} name={connection.name} strategy={connection.strategy} />);
			}),
			modalBody = ( <PreviewConnection selectedConnection={this.state.selectedConnection} closeHandler={this.closeModal} />);
			
		if (this.state.dialogBody == 'delete') {
			header = "Delete Confirmation";
			modalBody = (<DeleteConfirmation id={this.state.selectedConnection.id} name={this.state.selectedConnection.name} confirmHandler={this.onDeleteComplete} closeHandler={this.closeModal} />);
		} else if (this.state.dialogBody == 'form') {
			modalBody = (<ConnectionForm 
								selectedConnectionId={this.state.selectedConnection.id} 
								closeHandler={this.closeModal} 
								onSaveComplete={this.onSaveComplete}
								id={this.state.selectedConnection.id || null}
								name={this.state.selectedConnection.name || null} 
								strategy={this.state.selectedConnection.strategy || null}
								client_id={this.state.selectedConnection.options ? this.state.selectedConnection.options.client_id : null}
								client_secret={this.state.selectedConnection.options ? this.state.selectedConnection.options.client_secret : null} 
								authorizationURL={this.state.selectedConnection.options ? this.state.selectedConnection.options.authorizationURL : null} 
								tokenURL={this.state.selectedConnection.options ? this.state.selectedConnection.options.tokenURL : null} 
								scope={this.state.selectedConnection.options ? this.state.selectedConnection.options.scope : null} 
								fetchUserProfile={this.state.selectedConnection.options ? this.state.selectedConnection.options.scripts.fetchUserProfile : null} 
								/>);
		}
		
		var connectionsTable = (<table className="table table-striped">
							<thead>
								<tr>
									<th>Strategy</th>
									<th>Name</th>
									<th></th>
								</tr>
							</thead>
							<tbody>{rows}</tbody>
						</table>);
		if (this.state.connections.length == 0) {
			connectionsTable = (<p>There are no Custom OAuth2 Connections</p>);
		}
		
		return (
			<div className="container">
				<div className="page-header">
					<h1>Custom OAuth2 Connections <small>Auth0 Exercise</small></h1>
				</div>
				<div className="row">
				  	<div className="col-md-12">
						{{connectionsTable}}
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<button className="btn btn-primary" onClick={this.onAddClick}>Add</button>
					</div>
				</div>
				<Modal ref="modal" header={header} body={modalBody} />
			</div>
		);
	}
})