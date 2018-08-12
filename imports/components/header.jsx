import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import Accounts from "./accounts";
import { Notes } from "../collections/notes";


class Header extends Component {
	render() {
		console.log("RENDERING HEADER")
		return (
			<Navbar inverse collapseOnSelect fixedTop>
				<Navbar.Header>
					<Navbar.Brand>
						FoamBook
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					{!this.props.loading &&
						<Navbar.Text id="notesCount">
							{this.props.notesCount.reduce((a, b) => a + b.notesCount, 0)} notes & counting!
						</Navbar.Text>
					}
					<Nav pullRight>
						<LinkContainer exact to="/">
							<NavItem>
								Search
							</NavItem>
						</LinkContainer>
						<LinkContainer to="/add_note">
							<NavItem>
								Submit
							</NavItem>
						</LinkContainer>
						{this.props.user &&
							<LinkContainer to="/user_profile">
								<NavItem>
									{this.props.user.profile.name}
									<span className="glyphicon glyphicon-user" />
								</NavItem>
							</LinkContainer>
						}
						<LinkContainer to="/read_me">
							<NavItem>
								<span className="glyphicon glyphicon-question-sign" />
							</NavItem>
						</LinkContainer>
						<NavItem id="log-button">
							<Accounts />
						</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

Header = withTracker(() => {
	const handle = Meteor.subscribe("user.notesCount");
	return {
		// don't actually need any data, just get _ids so we can count them
		notesCount: Meteor.users.findFromPublication("user.notesCount", {}, { fields: { notesCount: 1 } }).fetch(),
		user: Meteor.user(),
		loading: !handle.ready() }
})(Header);

export default Header;
