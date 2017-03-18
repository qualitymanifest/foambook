import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';


class Accounts extends Component {

	componentDidMount() {
		this.view = Blaze.render(Template.loginButtons,
			ReactDOM.findDOMNode(this.refs.loginRender))
	}

	componentWillUnmount() {
		Blaze.remove(this.view);
	}

	render() {
		return (
			<div ref="loginRender"></div>
		)
	}
}

export default Accounts;
