import { Meteor } from "meteor/meteor";
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { connect } from "react-redux";
import { debounce } from "lodash";

import { downloadMethod } from "../methods";
import PreferenceForm from "./preference_form";
import { Notes } from "../collections/notes";
import NotesTable from "./notes_table";
import { incrementPages } from "../../client/actions";
import checkUserStatus from "../utils/checkUserStatus";
import { FORM_DEBOUNCE_MS } from "../utils/constants";

const UserProfile = ({ user = "LOADING", notes, paginate }) => {
	const checkUser = checkUserStatus(user, "user_profile");
	if (!checkUser.shouldRender) {
		return checkUser.renderInstead;
	}
	return (
		<div className="text-center fadeIn">
			<h3>Default submission values</h3>
			<PreferenceForm
				defaultValues={user.preferences}
			/>
			<div style={{ clear: "both" }}>You have submitted {user.notesCount} notes</div>
			<NotesTable
				notes={notes}
				user={user}
				appLocation="user_profile"
				caption="Your Recent Submissions" />
			{notes.length &&
				<>
					<button className="btn btn-primary" onClick={paginate} >Load More</button>
					<br /><br />
					<button className="btn btn-default" onClick={debounce(downloadMethod, FORM_DEBOUNCE_MS)}>
						Download Notes
					</button>
				</>
			}
		</div>
	);
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
