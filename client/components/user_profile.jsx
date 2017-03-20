import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { browserHistory } from "react-router";
import { Form, Text } from "react-form";
import { connect } from "react-redux";

import { Notes } from "../../imports/collections/notes";
import NotesTable from "./notes_table";
import { incrementPages } from "../actions";


class UserProfile extends Component {

	componentWillMount() {
		if (!this.props.user) {
			browserHistory.push("/");
		}
	}

	render() {
		return (
			<div>
				If you are going to be submitting notes for the same location and/or railroad,
				specify those here. That way, when you go to submit a note, those fields will
				be automatically filled for you!
				<NotesTable notes={this.props.notes} deleteFunc={true} />
				<button className="btn btn-primary" onClick={this.props.paginate} >Load More</button>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		paginate: () => {
			dispatch(incrementPages());
		}
	};
};

const MeteorUserProfile = createContainer(({ profileState }) => {
	Meteor.subscribe("user.notes", profileState.loadNum);
	return {
		// specifying userId again doesn't seem necessary but can prevent future bugs
		// see "Always use specific queries to fetch data" in guide
		notes: Notes.find({ userId: Meteor.userId() }, {
			sort: { createdAt: -1 },
			limit: profileState.loadNum
		}).fetch(),
		user: Meteor.user() };
}, UserProfile);

export default connect(({ profileState }) => ({ profileState }), mapDispatchToProps)(MeteorUserProfile);
