import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { connect } from "react-redux";

import PreferenceForm from "./preference_form";
import { Notes, NotesDelete, UserUpdate } from "../collections/notes";
import NotesTable from "./notes_table";
import { incrementPages } from "../../client/actions";
import { cleanCity } from "../validation";

class UserProfile extends Component {

	onSubmit(values) {
		let valuesCopy = Object.assign({}, values);
		if (valuesCopy.railroad) {
			valuesCopy.railroad = valuesCopy.railroad.toUpperCase();
		}
		if (valuesCopy.city) {
			valuesCopy.city = cleanCity(valuesCopy.city.toUpperCase());
		}
		if (valuesCopy.state) {
			valuesCopy.state = valuesCopy.state.toUpperCase();
		}
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
			defaultValues = this.props.user.preferences;
		}
		return (
			<div className="center">
				<h3>Default submission values</h3>
				<PreferenceForm
					onSubmit={this.onSubmit.bind(this)}
					defaultValues={defaultValues}
				/>
				<div style={{clear: "both"}}>You have submitted {this.props.user.notesCount} notes</div>
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
		}).fetch()
	};
})(UserProfile);

export default connect(({ profileState }) => ({ profileState }), mapDispatchToProps)(MeteorUserProfile);
