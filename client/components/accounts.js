import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';


class Accounts extends Component {

	componentDidMount() {
		// Render the Blaze accounts form, then find the div
		// we just rendered in the 'render' metod and place
		// the Blaze accounts form in that div
		// this.view is to save a reference to the rendered Blaze template, 
		// so later on we can clean up that template
		this.view = Blaze.render(Template.loginButtons,
			ReactDOM.findDOMNode(this.refs.loginRender))
	}

	componentWillUnmount() {
		// Go find the forms we created and destroy them
		// We need to clean up those forms ourselves
		Blaze.remove(this.view);
	}

	render() {
		return (
			<div ref="loginRender"></div>
		)
	}
}

export default Accounts;