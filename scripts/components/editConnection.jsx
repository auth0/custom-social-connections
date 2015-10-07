var EditConnection  = React.createClass({
    propTypes: {
        onSaveComplete:  React.PropTypes.func.isRequired
    },
    getInitialState: function(){
        return {
            strategy: this.props.selectedConnection ? this.props.selectedConnection.strategy : null ,
            name: this.props.selectedConnection ? this.props.selectedConnection.name : null 
        };
    },
    callSave: function(e){
        e.preventDefault();
        e.stopPropagation();
        
        var oldName = this.props.selectedConnection.name;
        
        // TODO: CALL API
        this.props.selectedConnection.strategy = this.state.strategy;
        this.props.selectedConnection.name = this.state.name;
        this.props.onSaveComplete(oldName, this.props.selectedConnection);
    },
    componentWillMount: function() {
        this.setState({
            strategy: this.props.selectedConnection ? this.props.selectedConnection.strategy : null ,
            name: this.props.selectedConnection ? this.props.selectedConnection.name : null 
        });
    },
    handleStrategyChange: function(event){
        this.setState({strategy: event.target.value});
    },
    handleNameChange: function(event){
        this.setState({name: event.target.value});
    },
    render: function() {
        if (!this.props.selectedConnection){
            return (<div>{ this.props.selectedConnection}</div>);
        }
    
        return (
            <form>
              <div className="form-group">
                <label htmlFor="strategy">Strategy</label>
                <input type="text" className="form-control" id="strategy" value={this.state.strategy } onChange={this.handleStrategyChange}/>
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name"  value={ this.state.name }  onChange={this.handleNameChange}/>
              </div>
              <button className="btn btn-default" onClick={this.callSave}>Submit</button>
            </form>
      );
    }
});


