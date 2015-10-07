var AuthConnectionRow  = React.createClass({
    propTypes: {
        strategy: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        selected:  React.PropTypes.func.isRequired,
        edit:  React.PropTypes.func.isRequired,
        remove:  React.PropTypes.func.isRequired
    },
    updateSelectedRow: function(el){
        $(el).closest("table").find("tr").removeClass("active");
        $(el).closest("tr").addClass("active");
    },
    callSelection: function(e){
        this.props.selected(this.props.name);
        this.updateSelectedRow(e.target);
    },
    callEdit: function(e){
        this.props.edit(this.props.name);
        this.updateSelectedRow(e.target);
    },
    callDelete: function(e){
        this.props.remove(this.props.name);
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
                    <button type="button" className="btn btn-default" onClick={this.callSelection}>View</button>
                    <button type="button" className="btn btn-default" onClick={this.callEdit}>Edit</button>
                    <button type="button" className="btn btn-danger"  onClick={this.callDelete} >Delete</button>
                </div>
              </td>
          </tr>
      );
    }
});
