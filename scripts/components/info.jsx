var PreviewConnection  = React.createClass({
    render: function() {
        if (!this.props.selectedConnection){
            return (<div>{ this.props.selectedConnection}</div>);
        }
    
        return (
             <div>
              <div className="group">
                <label>Name</label>
                <div><pre>{ this.props.selectedConnection.name }</pre> </div>
              </div>
              <div className="group">
                <label>Client ID</label>
                <div><pre>{ this.props.selectedConnection.options.client_id }</pre></div>
              </div>
              <div className="group">
                <label>Client Secret</label>
                <div><pre>{ this.props.selectedConnection.options.client_secret }</pre></div>
              </div>
              <div className="group">
                <label>Authorization URL</label>
                <div><pre>{ this.props.selectedConnection.options.authorizationURL } </pre></div>
              </div>
              <div className="group">
                <label>Token URL</label>
                <div><pre>{ this.props.selectedConnection.options.tokenURL }</pre></div>
              </div>
              <div className="group">
                <label>Scope</label>
                <div><pre>{ this.props.selectedConnection.options.scope }</pre></div>
              </div>
              <div className="group">
                <label>Fetch script</label>
                <div><pre className="prettyprint"><code class="language-js">{ this.props.selectedConnection.options.scripts.fetchUserProfile }</code></pre></div>
              </div>
            </div>
      );
    }
});
