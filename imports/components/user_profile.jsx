import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { connect } from "react-redux";
import _ from "lodash";

import PreferenceForm from "./preference_form";
import { Notes, NotesDelete, UserUpdate } from "../collections/notes";
import NotesTable from "./notes_table";
import { incrementPages } from "../../client/actions";
import { cleanLocation } from "../validation";

class UserProfile extends Component {

	onSubmit(values) {
		let valuesCopy = Object.assign({}, values);
		if (valuesCopy.railroad) {
			valuesCopy.railroad = valuesCopy.railroad.toUpperCase();
		}
		if (valuesCopy.location) {
			// location exists as a single string within the app, but as separate city/state in the db
			valuesCopy.location = valuesCopy.location.toUpperCase().split(", ");
			valuesCopy.city = valuesCopy.location.slice(0, valuesCopy.location.length - 1).join(", ");
			valuesCopy.state = valuesCopy.location.slice(valuesCopy.location.length - 1).join(" ");
		}
		delete valuesCopy.location;
		UserUpdate.call(valuesCopy, (err) => {
			if (err) {
				alert(err);
			}
		});
	}

	deleteFunc(noteId) {
		NotesDelete.call({ noteId }, (err) => {
			if (err) {
				alert(err);
			}
		});
	}

	render() {
		let defaultValues = null;
		if (!this.props.user) {
			// default props.user is "LOADING". if undefined, definitely not logged in.
			return <div className="center">You are not logged in!</div>;
		}
		if (this.props.user === "LOADING") {
			return <div className="spinner" />;
		}
		if (this.props.user.preferences) {
			// user is logged in, and has preferences. create defaults object for form!
			const { railroad, city, state, timezone } = this.props.user.preferences;
			defaultValues = {
				railroad,
				location: (city && state) ? city + ", " + state : "",
				timezone
			};
		}
		return (
			<div className="text-center">
				<PreferenceForm
					onSubmit={_.debounce(this.onSubmit.bind(this), 200)}
					defaultValues={defaultValues}
				/>
				<NotesTable 
					notes={this.props.notes} 
					deleteFunc={this.deleteFunc.bind(this)}
					caption="Your Recent Submissions" />
				{	!!this.props.notes.length &&
					<button className="btn btn-primary" onClick={this.props.paginate} >Load More</button>
				}
			</div>
		);
	}
}

UserProfile.defaultProps = {
	user: "LOADING"
};

const mapDispatchToProps = (dispatch) => {
	return {
		paginate: () => {
			dispatch(incrementPages());
		}
	};
};

const MeteorUserProfile = withTracker(({ profileState }) => {
	Meteor.subscribe("notes.user", profileState.loadNum);
	return {
		// specifying userId again doesn't seem necessary but can prevent future bugs
		// see "Always use specific queries to fetch data" in guide
		user: Meteor.user(),
		notes: Notes.findFromPublication("notes.user", { userId: Meteor.userId() }, {
			sort: { createdAt: -1 },
			limit: profileState.loadNum
		}).fetch() };
})(UserProfile);

export default connect(({ profileState }) => ({ profileState }), mapDispatchToProps)(MeteorUserProfile);
