var Modal = React.createClass({ 
	componentDidMount: function() {
    	$(this.getDOMNode()).modal({ background: true, keyboard: true, show: false})
	},
	componentWillUnmount: function(){
		$(this.getDOMNode()).off('hidden'); 
	},
	handleClick: function(e) {
		// Prevent closing 
		e.stopPropagation(); 
	},
	render: function() {
		return (<div onClick={this.handleClick} className="modal fade" role="dialog" aria-hidden="true">
				<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
        				<h4 class="modal-title">{this.props.header}</h4>
					</div>
					<div className="modal-body">{this.props.body}</div>
				</div>
				</div>
			</div>) 
	}
});
