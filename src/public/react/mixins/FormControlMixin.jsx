var FormControlMixin = {
  getInitialState: function () {
    return {
      value: this.props.defaultValue || ''
    };
  },
  getValue: function () {
    return this.state.value;
  },
  _handleChange: function (event) {
    this.setState({value: event.target.value});
  }
};

module.exports = FormControlMixin;
