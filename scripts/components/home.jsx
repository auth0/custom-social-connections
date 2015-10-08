var Home = React.createClass({ 
	getInitialState: function() {
		return { 
			connections: this.props.connections || [],
			selectedState: null,
			showFormDialogBox : false
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
	openConnectionDialogBox : function(id){
		this.setState({
			selectedConnection: this.state.connections.filter(function(el){ return el.id === id})[0],
			showFormDialogBox : false
		});
		$(this.refs.modal.getDOMNode()).modal(); 
	},
	openConnectionFormDialogBox: function(id){
		var selectedConnection = null;
		if (id) {
			selectedConnection = this.state.connections.filter(function(el){ return el.id === id})[0];
		}
		
		this.setState({ 
			selectedConnection: selectedConnection, 
			showFormDialogBox : true 
		});
		$(this.refs.modal.getDOMNode()).modal(); 
	},
	onSaveComplete: function(connection){
		this.closeModal();
		this.setState({ connections : this.addOrUpdateConnectionList(connection) });
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
	onDeleteComplete: function(id){
		var connection = new Connection(),
			onComplete = function(){
				this.closeModal(); 				
				this.setState({ connections : this.state.connections.filter(function(connection){ return connection.id !== id; }) });
			};
		connection.delete(id, onComplete.bind(this));
	},
	onAddClick: function() {
		this.openConnectionFormDialogBox();	
	},
	closeModal: function(){
		$(this.refs.modal.getDOMNode()).modal('hide'); 		
		this.setState({showFormDialogBox : false, selectedConnection : null});
	},
	render: function() {
		var that = this,
			header = (this.state.selectedConnection ? this.state.selectedConnection.name : '') + ' Custom OAuth2 Connection',
			rows = this.state.connections.map(function (connection) {
				return ( <AuthConnectionRow 
							selected={that.openConnectionDialogBox}
							edit={that.openConnectionFormDialogBox}
							remove={that.onDeleteComplete}
							id={connection.id}
							name={connection.name} 
							strategy={connection.strategy} />);
			}),
			showTemplate = ( <PreviewConnection selectedConnection={this.state.selectedConnection} closeHandler={this.closeModal} />);
			
		if (this.state.showFormDialogBox){
			showTemplate = (<ConnectionForm selectedConnection={this.state.selectedConnection} closeHandler={this.closeModal} onSaveComplete={this.onSaveComplete} />);
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
						<button className="btn btn-primary"  onClick={this.onAddClick}>Add</button>
					</div>
				</div>
				<Modal ref="modal" header={header} body={showTemplate} />
			</div>
		);
	}
})