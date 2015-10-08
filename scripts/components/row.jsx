var AuthConnectionRow  = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        strategy: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        openDialog:  React.PropTypes.func.isRequired
    },
    callSelection: function(e){
        this.props.openDialog(this.props.id, "info");
    },
    callEdit: function(e){
        this.props.openDialog(this.props.id, "form");
    },
    callDelete: function(e){
        this.props.openDialog(this.props.id, "delete");
    },
    render: function() {
        return (
            <tr>
              <td width="30%">
                  { this.props.strategy }
              </td>
              <td width="40%">
                  { this.props.name }
              </td>
              <td width="30%">
                <div className="btn-group" role="group" aria-label="...">
                    <button type="button" className="btn btn-default" disabled="disabled">Try It</button>                    
                    <button type="button" className="btn btn-default" onClick={this.callSelection}>Details</button>
                    <button type="button" className="btn btn-default" onClick={this.callEdit}>Edit</button>
                    <button type="button" className="btn btn-danger"  onClick={this.callDelete} >Delete</button>
                </div>
              </td>
          </tr>
      );
    }
});
