import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import { IndexLinkContainer, LinkContainer } from "react-router-bootstrap";

import Accounts from "./accounts";
import { Notes } from "../collections/notes";

/* the forceUpdate on click is to re-render the header after the
	'.active' NavItem changes. this is a temp fix */

class Header extends Component {
	render() {
		return (
			<Navbar inverse collapseOnSelect fixedTop>
				<Navbar.Header>
					<Navbar.Brand>
						FoamBook
					</Navbar.Brand>
					{/* show current path so that mobile devices can see where they're at
					<Navbar.Text className="visible-xs-inline-block">
						PROFILE
					</Navbar.Text>*/}
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					{!this.props.loading &&
						<Navbar.Text id="notesCount">
							{this.props.notesCount.reduce((a, b) => a + b.notesCount, 0)} notes & counting!
						</Navbar.Text>
					}
					<Nav pullRight>
						<IndexLinkContainer onClick={() => this.forceUpdate()} to="/">
							<NavItem>
								Search
							</NavItem>
						</IndexLinkContainer>
						<LinkContainer onClick={() => this.forceUpdate()} to="/add_note">
							<NavItem>
								Submit
							</NavItem>
						</LinkContainer>
						{this.props.user &&
							<LinkContainer onClick={() => this.forceUpdate()} to="/user_profile">
								<NavItem>
									{this.props.user.profile.name}
								</NavItem>
							</LinkContainer>
						}
						<LinkContainer onClick={() => this.forceUpdate()} to="/read_me">
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
		loading: !handle.ready() };
})(Header);

export default Header;
