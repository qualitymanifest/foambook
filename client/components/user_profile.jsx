import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { browserHistory } from "react-router";
import { connect } from "react-redux";
import _ from "lodash";

import PreferenceForm from "./preference_form";
import { Notes } from "../../imports/collections/notes";
import NotesTable from "./notes_table";
import { incrementPages } from "../actions";

class UserProfile extends Component {

	componentWillMount() {
		if (!this.props.user) {
			browserHistory.push("/");
		}
	}

	onSubmit(values) {
		Meteor.call("user.update", values, (err, res) => {
			if (err) {
				alert(err);
			}
		});
	}

	render() {
		return (
			<div className="center">
				You can set default form values here so you don't have to type them in every time!
				Note: default time in time input field will reflect timezone specified here.	
				<PreferenceForm 
					onSubmit={_.debounce(this.onSubmit.bind(this), 200)}
				/>
				<NotesTable notes={this.props.notes} deleteFunc={true} />
				{	!!this.props.notes.length &&
					<button className="btn btn-primary" onClick={this.props.paginate} >Load More</button>
				}
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
