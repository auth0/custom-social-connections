var Modal = React.createClass({ 
	propTypes: {
        body: React.PropTypes.element,
        header: React.PropTypes.string,
    },
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
		var body = this.props.body;
	
		return (<div onClick={this.handleClick} className="modal fade" role="dialog" aria-hidden="true">
				<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
        				<h4 className="modal-title">{this.props.header}</h4>
					</div>
					{body}
				</div>
				</div>
			</div>) 
	}
});
