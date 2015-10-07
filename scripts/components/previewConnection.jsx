var PreviewConnection  = React.createClass({
    render: function() {
        if (!this.props.selectedConnection){
            return (<div>{ this.props.selectedConnection}</div>);
        }
    
        return (
            <div>
                <div>
                    <strong>Strategy: </strong>{ this.props.selectedConnection.strategy }
                </div>
                <div>
                    <strong>Name: </strong> { this.props.selectedConnection.name }
                </div>
            </div>
      );
    }
});
