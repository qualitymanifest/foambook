import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data'

import Header from './header';
/*
export default (props) => {
	return (
		<div>
			<Header />
			{props.children}		
		</div>
	)
}
*/

class App extends Component {
	render(props) {
		return (
			<div>
				<Header />
				{this.props.children}
			</div>
		)
	}
}
/*
App = createContainer(() => {
	Meteor.subscribe('user');
	return {user}
}, App);
*/
export default App