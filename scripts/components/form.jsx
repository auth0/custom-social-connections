var ConnectionForm  = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        strategy: React.PropTypes.string,
        name: React.PropTypes.string,
        client_id: React.PropTypes.string,
        client_secret: React.PropTypes.string,
        authorizationURL: React.PropTypes.string,
        tokenURL: React.PropTypes.string,
        scope: React.PropTypes.string,
        fetchUserProfile: React.PropTypes.string,
        selectedConnection: React.PropTypes.string,
        onSaveComplete:  React.PropTypes.func.isRequired,
        closeHandler: React.PropTypes.func.isRequired
    },
     componentWillReceiveProps: function(nextProps){
        this.prepareComponentState(nextProps);
    },
     prepareComponentState: function(props){
        this.setState({
            id: props.id,
            strategy: props.strategy || "oauth2",
            name: props.name,
            client_id: props.client_id,
            client_secret: props.client_secret,
            authorizationURL: props.authorizationURL,
            tokenURL: props.tokenURL,
            scope: props.scope,
            fetchUserProfile: props.fetchUserProfile
        });
    },
    getInitialState: function(){
        return {
            id: this.props.id,
            strategy: this.props.strategy || "oauth2",
            name: this.props.name,
            client_id: this.props.client_id,
            client_secret: this.props.client_secret,
            authorizationURL: this.props.authorizationURL,
            tokenURL: this.props.tokenURL,
            scope: this.props.scope,
            fetchUserProfile: this.props.fetchUserProfile
        };
    },
    callSave: function(e){
        e.preventDefault();
        e.stopPropagation();
        var connection = new Connection(),
            errorCallback = function(err) {
                alert('Error when calling the API :' + err.responseJSON.message);
            },
            completeCallback = function(connection){
                this.props.onSaveComplete(connection);        
            };
            
        if (this.props.selectedConnectionId){
            connection.update(this.props.selectedConnectionId, this.createBaseConnectionObject(), completeCallback.bind(this) ,errorCallback.bind(this));       
        } else {
            var newState =  this.createBaseConnectionObject();
            newState['strategy'] = this.state.strategy;
            connection.create(newState, completeCallback.bind(this) ,errorCallback.bind(this));   
        } 
    },
    createBaseConnectionObject: function(){
        var connectionObject = {
            name: this.state.name,
            options : { 
                client_id: this.state.client_id,
                client_secret: this.state.client_secret,
                authorizationURL: this.state.authorizationURL,
                tokenURL: this.state.tokenURL,
                scope: this.state.scope
            }
        };
        
        if (this.state.fetchUserProfile){
            connectionObject['options']['scripts'] = {
                fetchUserProfile: this.state.fetchUserProfile 
            };
        }

        return connectionObject;
    },
    callClose: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.closeHandler();
    },
    componentWillMount: function() {
        this.setState({
            id: this.props.id,
            strategy: this.props.strategy || "oauth2",
            name: this.props.name,
            client_id: this.props.client_id,
            client_secret: this.props.client_secret,
            authorizationURL: this.props.authorizationURL,
            tokenURL: this.props.tokenURL,
            scope: this.props.scope,
            fetchUserProfile: this.props.fetchUserProfile 
        });
    },
    handleClientIdChange: function(event){
        this.setState({client_id: event.target.value});
    },
    handleNameChange: function(event){
        this.setState({name: event.target.value});
    },
     handleClientSecretChange: function(event){
        this.setState({client_secret: event.target.value});
    },
     handleAuthorizationUrlChange: function(event){
        this.setState({authorizationURL: event.target.value});
    },
     handleTokenUrlChange: function(event){
        this.setState({tokenURL: event.target.value});
    },
     handleScopeChange: function(event){
        this.setState({scope: event.target.value});
    },
     handleFetchUserProfileChange: function(value){
        this.setState({fetchUserProfile:  value});
    },
    render: function() {
        return (
            <form>
                <div className="modal-body">
                    <div className="form-group">
                        <label htmlFor="strategy">Strategy</label>
                        <input disabled="disabled" type="text" className="form-control" id="strategy" value={ this.state.strategy }  />
                    </div> 
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" id="name" value={ this.state.name } onChange={this.handleNameChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="client_id">Client ID</label>
                        <input type="text" className="form-control" id="client_id" value={ this.state.client_id } onChange={this.handleClientIdChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="client_secret">Client Secret</label>
                        <input type="text" className="form-control" id="client_secret" value={ this.state.client_secret } onChange={this.handleClientSecretChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="auth_url">Authorization URL</label>
                        <input type="text" className="form-control" id="auth_url" value={ this.state.authorizationURL } onChange={this.handleAuthorizationUrlChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="token">Token URL</label>
                        <input type="text" className="form-control" id="token" value={ this.state.tokenURL } onChange={this.handleTokenUrlChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="scope">Scope</label>
                        <input type="text" className="form-control" id="scope" value={ this.state.scope } onChange={this.handleScopeChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="script">Fetch user profile script</label>
                        <TextEditor script={ this.state.fetchUserProfile || '' } textChange={this.handleFetchUserProfileChange} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={this.callSave}>Submit</button>
                    <button className="btn btn-default" onClick={this.callClose}>Close</button>
                </div>
            </form>
      );
    }
});


