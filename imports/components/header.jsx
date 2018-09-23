import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { connect } from "react-redux";

import Accounts from "./accounts";
import { Notes } from "../collections/notes";
import { changePath } from "../../client/actions";


class Header extends Component {
	render() {
		return (
			<Navbar inverse collapseOnSelect fixedTop>
				<Navbar.Header>
					<LinkContainer to="/" onClick={() => this.props.changePath("/")}>
						<Navbar.Brand>
							FoamBook
						</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					{!this.props.loading &&
						<Navbar.Text id="notesCount">
							{this.props.notesCount.reduce((a, b) => a + b.notesCount, 0)} notes & counting!
						</Navbar.Text>
					}
					<Nav pullRight activeKey={this.props.router.location.pathname}>
						<LinkContainer eventKey="/"
							exact to="/">
							<NavItem>
								Search
							</NavItem>
						</LinkContainer>
						<LinkContainer eventKey="/add_note"
							to="/add_note">
							<NavItem>
								Submit
							</NavItem>
						</LinkContainer>
						<LinkContainer eventKey="/read_me"
							to="/read_me">
							<NavItem>
								README
							</NavItem>
						</LinkContainer>
						{this.props.user &&
							<LinkContainer eventKey="/user_profile"
								to="/user_profile">
								<NavItem id="userName">
									{this.props.user.profile.name}
								</NavItem>
							</LinkContainer>
						}
						<NavItem id="log-button">
							<Accounts />
						</NavItem>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

Header = withTracker(({ router }) => {
	const handle = Meteor.subscribe("user.notesCount");
	return {
		// don't actually need any data, just get _ids so we can count them
		notesCount: Meteor.users.findFromPublication("user.notesCount", {}, { fields: { notesCount: 1 } }).fetch(),
		user: Meteor.user(),
		loading: !handle.ready() }
})(Header);

export default connect(({ router }) => ({ router }))(Header);
