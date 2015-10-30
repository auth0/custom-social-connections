var PreviewConnection  = React.createClass({
  render: function() {
    if (!this.props.selectedConnection.id) {
      return (<div>{ this.props.selectedConnection}</div>);
    }

    return (
      <div className="modal-body">
        <div className="form-group">
          <label>Name</label>
          <div>{ this.props.selectedConnection.name } </div>
        </div>
        <div className="form-group">
          <label>Client ID</label>
          <div>{ this.props.selectedConnection.options.client_id }</div>
        </div>
        <div className="form-group">
          <label>Client Secret</label>
          <div>{ this.props.selectedConnection.options.client_secret }</div>
        </div>
        <div className="form-group">
          <label>Authorization URL</label>
          <div>{ this.props.selectedConnection.options.authorizationURL } </div>
        </div>
        <div className="form-group">
          <label>Token URL</label>
          <div>{ this.props.selectedConnection.options.tokenURL }</div>
        </div>
        <div className="form-group">
          <label>Scope</label>
          <div>{ this.props.selectedConnection.options.scope }</div>
        </div>
        <div className="form-group">
          <label>Fetch user profile script</label>
          <div><pre className="prettyprint"><code className="language-js">{ this.props.selectedConnection.options.scripts.fetchUserProfile }</code></pre></div>
        </div>
      </div>
    );
  }
});
