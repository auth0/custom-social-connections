var DeleteConfirmation  = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        name: React.PropTypes.string,
        confirmHandler: React.PropTypes.func.isRequired
    },
    handleConfirm: function(e){
        e.preventDefault();
        e.stopPropagation()
        this.props.confirmHandler(this.props.id);
    },
    handleCancel: function(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.closeHandler();
    },
    render: function() {
        return (
            <form>
                <div className="modal-body">
                     Are you sure that you want to delete connection <strong>{this.props.name}</strong>?
                </div>
                <div className="modal-footer">
                    <button className="btn btn-danger" onClick={this.handleConfirm}>Delete</button>
                    <button className="btn btn-default" onClick={this.handleCancel}>Cancel</button>
                </div>
            </form>
      );
    }
});


