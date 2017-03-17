import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import Accounts from './accounts';

class Header extends Component {
/*	onBinClick(e) {
		e.preventDefault(); // don't try to navigate

		Meteor.call('bins.insert', (error, binId) => {
			// url is essentially put onto a stack that allows users to
			// navigate backwards and forwards
			browserHistory.push(`/bins/${binId}`)
		})
	} */
	render() {
		const pathname = browserHistory.getCurrentLocation().pathname
		let toggle;
		if (pathname === '/add_note') {
			toggle = <Link to='/'>Search notes</Link>
		}
		else {
			toggle = <Link to='/add_note'>Submit notes</Link>
		}
		return (
			<nav className="nav navbar-default">
				<div className="navbar-header">
					<a className="navbar-brand">Train Notes</a>
				</div>
				<ul className="nav navbar-nav">
					<li>
						<Accounts />
					</li>
					<li>
						{toggle}
					</li>
				</ul>
			</nav>
		)
	}
}

export default Header;