import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data'

import Accounts from './accounts';

class Header extends Component {
	render() {
		const searchNotes = <li><Link to='/'>Search Notes</Link></li>;
		const addNotes = <li><Link to='/add_note'>Submit Notes</Link></li>;
		const pathname = browserHistory.getCurrentLocation().pathname
		let toggle;

		return (
			<nav className="nav navbar-inverse navbar-fixed-top">
				<ul className="nav navbar-nav">
					<li>
						<Link to='/'>Search</Link>
					</li>
					<li>
						<Link to='/add_note'>Submit</Link>
					</li>
					<li>
					 {this.props.user ? 
					 	<Link to="/user_profile">
					 		{this.props.user.profile.name}
					 	</Link>
					 : null}
					</li>
					<li>
						<Accounts />
					</li>
				</ul>
			</nav>
		)
	}
}

Header = createContainer(() => {
	return { 
		user : Meteor.user() }
}, Header);

export default Header;