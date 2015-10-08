var TextEditor = React.createClass({ 
	propTypes: {
        script: React.PropTypes.string,
    },
	getInitialState: function(){
		return {
			scripts: this.props.script || ''
		}
	},
	componentDidMount: function() {
        this.prepareComponentState();
		
		this.codeEditor = CodeMirror.fromTextArea(this.refs.snippet.getDOMNode(), {
			value: this.state.scripts,
			mode:  'javascript',
		});
		this.codeEditor.on('change', this.callChange);
	},
	 componentDidUpdate: function() {
		if (this.codeEditor != null) {	
			if (this.props.script != null) {
				if (this.codeEditor.getValue() !== this.props.script) {
					this.codeEditor.setValue(this.props.script);
				}
			}
		}
	},
	componentWillReceiveProps: function(nextProps){
        this.prepareComponentState(nextProps);
    },
	callChange: function(event){
		this.props.textChange(this.codeEditor.getValue());
		this.setState({scripts:  this.codeEditor.getValue()});
	},
     prepareComponentState: function(newProps){
	 	var props = newProps || this.props;
        this.setState({
           script: props.script
        });
    },
	render: function() {
		var style = { 
			border: '1px solid #ccc',
			borderRadius: '4px'
		};
		return (<div style={style}><textarea ref="snippet" value={this.state.scripts}  onChange={this.callChange}></textarea></div>) 
	}
});
