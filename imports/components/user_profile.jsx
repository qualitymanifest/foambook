import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { connect } from "react-redux";
import { debounce } from "lodash";

import { notesDeleteMethod, preferenceSubmitMethod, downloadMethod } from "../methods";
import PreferenceForm from "./preference_form";
import { Notes } from "../collections/notes";
import NotesTable from "./notes_table";
import { incrementPages } from "../../client/actions";
import checkUserStatus from "../checkUserStatus";

class UserProfile extends Component {
	render() {
		let defaultValues = null;
		const { user, notes, paginate} = this.props;
		const checkUser = checkUserStatus(user, "user_profile");
		if (!checkUser.shouldRender) {
			return checkUser.renderInstead;
		}
		if (user.preferences) {
			defaultValues = user.preferences;
		}
		return (
			<div className="text-center fadeIn">
				<h3>Default submission values</h3>
				<PreferenceForm
					onSubmit={preferenceSubmitMethod}
					defaultValues={defaultValues}
				/>
				<div style={{clear: "both"}}>You have submitted {user.notesCount} notes</div>
				<NotesTable 
					notes={notes} 
					user={user} 
					deleteFunc={notesDeleteMethod}
					appLocation="user_profile"
					caption="Your Recent Submissions" />
				{	!!notes.length &&
					<>
						<button className="btn btn-primary" onClick={paginate} >Load More</button>
						<br /><br />
						<button className="btn btn-default" onClick={debounce(downloadMethod, 1000)}>Download Notes</button>
					</>
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
