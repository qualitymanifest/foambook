import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Form, Text } from "react-form";
import _ from "lodash";
import { withTracker } from "meteor/react-meteor-data";
import Moment from "moment-timezone";

import { Notes, NotesInsert } from "../collections/notes";
import { submitValidation, cleanLocation } from "../validation";
import DateTime from "./dateTime";
import NotesTable from "./notes_table";

Moment.tz.setDefault("Etc/UTC");

class AddNoteForm extends Component {

	onSubmit(values) {
		const valuesCopy = Object.assign({}, values);
		const cleanedLocation=cleanLocation(valuesCopy.location.toUpperCase());
		valuesCopy.railroad = valuesCopy.railroad.toUpperCase();
		valuesCopy.city = cleanedLocation.slice(0, cleanedLocation.length - 1).join(", ");
		valuesCopy.state = cleanedLocation.slice(cleanedLocation.length - 1).join(" ");
		delete valuesCopy.location;
		valuesCopy.symbol = valuesCopy.symbol.toUpperCase();
		valuesCopy.dateTime = Moment(valuesCopy.dateTime, "MM-DD-YY HH:mm").toDate();
		document.querySelector("#symbol").focus();
		NotesInsert.call(valuesCopy, (err) => {
			if (err) {
				alert(err);
			}
		});
	}

	render() {
		// in case user turns out to be logged in but has no default preferences
		let defaultValues = null;
		if (!this.props.user) {
			// default props.user is "LOADING". if undefined, definitely not logged in.
			return <div className="center">Please log in to submit train notes</div>;
		}
		if (this.props.user === "LOADING") {
			return <div className="spinner" />;
		}
		if (this.props.user.preferences) {
			// user is logged in, and has preferences. create defaults object for form!
			const { railroad, city, state, timezone } = this.props.user.preferences;
			defaultValues = {
				railroad,
				location: city && state ? city + ", " + state : "",
				dateTime: timezone ? Moment().tz(timezone).format("MM-DD-YY HH:mm") : ""
			};
		}
		return (
			<div className="center">
			<Form
				onSubmit={_.debounce(this.onSubmit.bind(this), 200)}
				defaultValues={defaultValues}
				/* input values aren't really uppercase, its just the css. i was previously
				using prevalidate to uppercase, but that ran the function on every keystroke and would
				move the text cursor if you tried to update the middle of the word. */
				validate={values => submitValidation(
					_.mapValues(values, val => val && typeof val === "string" ? val.toUpperCase() : null)
				)}
			>
				{({ submitForm }) => (
						<form onSubmit={submitForm}>
							<div className="form-group col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 col-md-2 col-md-offset-5">
								<label>Railroad</label>
								<Text className="form-control" field="railroad" placeholder="E.G. CSX" />
								<label>Location</label>
								<Text className="form-control" field="location" placeholder="E.G. PITTSBURGH, PA" />
								<label>Symbol</label>
								<Text className="form-control" field="symbol" id="symbol" placeholder="E.G. Q138" autoFocus />
								<label>Date/Time</label>
								<DateTime className="form-control" field="dateTime" placeholder="MM-DD-YY 23:59" />
								<button className="btn btn-primary btn-block">
									<span className="glyphicon glyphicon-pencil" />
									Submit
								</button>
							</div>
						</form>
					)}

			</Form>
			<NotesTable notes={this.props.notes} caption="Recent Submissions - All Users" />
			</div>
		);
	}
}

AddNoteForm.defaultProps = {
	user: "LOADING"
};

const MeteorAddNoteForm = withTracker(() => {
	Meteor.subscribe("notes", 5);
	return {
		notes: Notes.findFromPublication("notes", {}, {
			sort: { createdAt: -1 },
			limit: 5
		}).fetch(),
		user: Meteor.user()
	};
})(AddNoteForm);

export default MeteorAddNoteForm;
