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
						<LinkContainer onClick={() => this.props.changePath("/")} className={this.props.pathState === "/" ? "active" : ""}
							exact to="/">
							<NavItem>
								Search
							</NavItem>
						</LinkContainer>
						<LinkContainer onClick={() => this.props.changePath("/add_note")} className={this.props.pathState === "/add_note" ? "active" : ""}
							to="/add_note">
							<NavItem>
								Submit
							</NavItem>
						</LinkContainer>
						{this.props.user &&
							<LinkContainer onClick={() => this.props.changePath("/user_profile")} className={this.props.pathState === "/user_profile" ? "active" : ""}
								to="/user_profile">
								<NavItem>
									{this.props.user.profile.name}
									<span className="glyphicon glyphicon-user" />
								</NavItem>
							</LinkContainer>
						}
						<LinkContainer onClick={() => this.props.changePath("/read_me")} className={this.props.pathState === "/read_me" ? "active" : ""}
							to="/read_me">
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

const mapDispatchToProps = (dispatch) => {
	// put query in state so that it will be the same when user navigates back
	return {
		changePath: (path) => {
			dispatch(changePath(path));
		}
	};
};

Header = withTracker(({ pathState }) => {
	const handle = Meteor.subscribe("user.notesCount");
	return {
		// don't actually need any data, just get _ids so we can count them
		notesCount: Meteor.users.findFromPublication("user.notesCount", {}, { fields: { notesCount: 1 } }).fetch(),
		user: Meteor.user(),
		loading: !handle.ready() }
})(Header);

export default connect(({ pathState }) => ({ pathState }), mapDispatchToProps)(Header);
