var ConnectionForm  = React.createClass({
    propTypes: {
        onSaveComplete:  React.PropTypes.func.isRequired,
        closeHandler: React.PropTypes.func.isRequired
    },
    getInitialState: function(){
        return {
            id: this.props.selectedConnection ? this.props.selectedConnection.id : null ,
            strategy: this.props.selectedConnection ? this.props.selectedConnection.strategy : "oauth2",
            name: this.props.selectedConnection ? this.props.selectedConnection.name : null ,
            client_id: this.props.selectedConnection ? this.props.selectedConnection.options.client_id : null,
            client_secret: this.props.selectedConnection ? this.props.selectedConnection.options.client_secret : null,
            authorizationURL: this.props.selectedConnection ? this.props.selectedConnection.options.authorizationURL : null,
            tokenURL: this.props.selectedConnection ? this.props.selectedConnection.options.tokenURL : null,
            scope: this.props.selectedConnection ? this.props.selectedConnection.options.scope : null,
            fetchUserProfile:this.props.selectedConnection  && this.props.selectedConnection.options.scripts ? this.props.selectedConnection.options.scripts.fetchUserProfile : null
        };
    },
    callSave: function(e){
        e.preventDefault();
        e.stopPropagation();
        var connection = new Connection(),
            errorCallback = function(err) {
                alert('Error when calling the API :' + err.responseJSON.message);
                this.props.closeHandler();
            },
            completeCallback = function(connection){
                this.props.onSaveComplete(connection);        
            };
            
        if (this.props.selectedConnection){
            var updateState = {
                name: this.state.name,
                options : { 
                    client_id: this.state.client_id,
                    client_secret: this.state.client_secret,
                    authorizationURL: this.state.authorizationURL,
                    tokenURL: this.state.tokenURL,
                    scope: this.state.scope,
                    scripts: {
                        fetchUserProfile:this.state.fetchUserProfile
                    }
                }
            };
            connection.update(this.props.selectedConnection.id, updateState, completeCallback.bind(this) ,errorCallback.bind(this));       
        } else {
            var newState = {
                    strategy: this.state.strategy,
                    name: this.state.name,
                    options : { 
                        client_id: this.state.client_id,
                        client_secret: this.state.client_secret,
                        authorizationURL: this.state.authorizationURL,
                        tokenURL: this.state.tokenURL,
                        scope: this.state.scope,
                        scripts: {
                            fetchUserProfile:this.state.fetchUserProfile
                        }
                    }
                };
            connection.create(newState, completeCallback.bind(this) ,errorCallback.bind(this));   
        } 
    },
    callClose: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.closeHandler();
    },
    componentWillMount: function() {
        this.setState({
            id: this.props.selectedConnection ? this.props.selectedConnection.id : null ,
            strategy: this.props.selectedConnection ? this.props.selectedConnection.strategy : "oauth2",
            name: this.props.selectedConnection ? this.props.selectedConnection.name : null ,
            client_id: this.props.selectedConnection ? this.props.selectedConnection.options.client_id : null,
            client_secret: this.props.selectedConnection ? this.props.selectedConnection.options.client_secret : null,
            authorizationURL: this.props.selectedConnection ? this.props.selectedConnection.options.authorizationURL : null,
            tokenURL: this.props.selectedConnection ? this.props.selectedConnection.options.tokenURL : null,
            scope: this.props.selectedConnection ? this.props.selectedConnection.options.scope : null,
            fetchUserProfile:this.props.selectedConnection  && this.props.selectedConnection.options.scripts ? this.props.selectedConnection.options.scripts.fetchUserProfile : null 
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
     handleFetchUserProfileChange: function(event){
        this.setState({fetchUserProfile: event.target.value});
    },
    render: function() {
        return (
            <form>
              <div className="form-group">
                <label htmlFor="strategy">Strategy</label>
                <input disabled="disabled" type="text" className="form-control" id="strategy"  value={ this.state.strategy }  />
              </div> 
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name"  value={ this.state.name }  onChange={this.handleNameChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="name">Client ID</label>
                <input type="text" className="form-control" id="name"  value={ this.state.client_id }  onChange={this.handleClientIdChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="name">Client Secret</label>
                <input type="text" className="form-control" id="name"  value={ this.state.client_secret }  onChange={this.handleClientSecretChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="name">Authorization URL</label>
                <input type="text" className="form-control" id="name"  value={ this.state.authorizationURL }  onChange={this.handleAuthorizationUrlChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="name">Token URL</label>
                <input type="text" className="form-control" id="name"  value={ this.state.tokenURL }  onChange={this.handleTokenUrlChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="name">Scope</label>
                <input type="text" className="form-control" id="name"  value={ this.state.scope }  onChange={this.handleScopeChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="sctipt">Fetch script</label>
                <input type="text" className="form-control" id="script"  value={ this.state.fetchUserProfile }  onChange={this.handleFetchUserProfileChange}/>
              </div>
              <button className="btn btn-default" onClick={this.callSave}>Submit</button>
              <button className="btn btn-default" onClick={this.callClose}>Close</button>
            </form>
      );
    }
});


