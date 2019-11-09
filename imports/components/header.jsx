import { Meteor } from "meteor/meteor";
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { connect } from "react-redux";

import Accounts from "./accounts";


const Header = ({ loading, notesCount, router, user }) => {
	const count = notesCount.reduce((a, b) => a + b.notesCount, 0);
	return (
		<Navbar inverse collapseOnSelect fixedTop>
			<Navbar.Header>
				<LinkContainer to="/">
					<Navbar.Brand>Foambook</Navbar.Brand>
				</LinkContainer>
				<Navbar.Toggle />
			</Navbar.Header>
			<Navbar.Collapse>
				{!loading &&
					(
						<Navbar.Text id="notesCount" className="fadeIn">
							{`${count} notes & counting!`}
						</Navbar.Text>
					)
				}
				<Nav pullRight activeKey={router.location.pathname}>
					<LinkContainer
						eventKey="/"
						exact
						to="/"
					>
						<NavItem>Search</NavItem>
					</LinkContainer>
					<LinkContainer
						eventKey="/add_note"
						to="/add_note"
					>
						<NavItem>Submit</NavItem>
					</LinkContainer>
					<LinkContainer
						eventKey="/read_me"
						to="/read_me"
					>
						<NavItem>README</NavItem>
					</LinkContainer>
					{user && user.profile &&
						(
							<LinkContainer
								eventKey="/user_profile"
								to="/user_profile"
							>
								<NavItem id="userName" className="fadeIn">
									{user.profile.name}
								</NavItem>
							</LinkContainer>
						)
					}
					<NavItem id="log-button">
						<Accounts />
					</NavItem>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

const MeteorHeader = withTracker(() => {
	const handle = Meteor.subscribe("user.notesCount");
	return {
		// don't actually need any data, just get _ids so we can count them
		notesCount: Meteor.users.findFromPublication("user.notesCount", {}, { fields: { notesCount: 1 } }).fetch(),
		user: Meteor.user(),
		loading: !handle.ready()
	};
})(Header);

export default connect(({ router }) => ({ router }))(MeteorHeader);
