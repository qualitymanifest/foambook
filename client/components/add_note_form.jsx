import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Form, Text } from "react-form";
import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";
import Moment from "moment-timezone";

import { Notes } from "../../imports/collections/notes";
import { submitValidation, cleanLocation } from "../../imports/validation";
import DateTime from "./dateTime";
import NotesTable from "./notes_table";

Moment.tz.setDefault("Etc/UTC");

class AddNoteForm extends Component {


	onSubmit(values) {
	/* had to clone using Object.assign because previously added
	values were changing to be the lowercased first letter of the
	new value????????? */
		const valuesCopy = Object.assign({}, values);
		valuesCopy.railroad = valuesCopy.railroad.toUpperCase();
		valuesCopy.location = cleanLocation(valuesCopy.location.toUpperCase());
		valuesCopy.symbol = valuesCopy.symbol.toUpperCase();
		valuesCopy.dateTime = Moment(valuesCopy.dateTime, "MM-DD-YY HH:mm").toDate();
	// clear out symbol and date fields:

	// assuming user isn't constantly changing rr/loc, focus on symbol
		document.querySelector("#symbol").focus();
		Meteor.call("notes.insert", valuesCopy, (err, res) => {
			if (err) {
				alert(err);
			}
		});
	}

	render() {
		// in case user turns out to be logged in but have no default preferences
		let defaultValues = null;
		if (!this.props.user) {
			// default props.user is "LOADING". if undefined, definitely not logged in.
			return <div>Please log in to submit train notes</div>;
		}
		if (this.props.user === "LOADING") {
			return <div>LOADING SPINNER...</div>;
		}
		if (this.props.user.preferences) {
			// user is logged in, and has preferences. create defaults object for form!
			const { railroad, location, timezone } = this.props.user.preferences;
			defaultValues = {
				railroad : railroad ? railroad : "",
				location : location ? location : "",
				dateTime: timezone ? Moment().tz(timezone).format("MM-DD-YY HH:mm") : ""
			};
		}

		return (
			<div className="center">
			<Form
				onSubmit={_.debounce(this.onSubmit.bind(this), 200)}
				defaultValues={ defaultValues }
				/* input values aren't really uppercase, its just the css. i was previously
				using prevalidate to uppercase, but that ran the function on every keystroke and would
				move the text cursor if you tried to update the middle of the word. */
				validate={values => submitValidation(
					_.mapValues(values, value => value ? value.toUpperCase() : null)
				)}
			>
				{({ submitForm }) => (
						<form onSubmit={submitForm}>
							<label>Railroad</label>
							<Text field="railroad" placeholder="UP | ??" />
							<label>Location</label>
							<Text field="location" placeholder="Tucson, AZ" />
							<label>Symbol</label>
							<Text field="symbol" id="symbol" placeholder="SYMBOL" autoFocus />
							<label>Date/Time</label>
							<DateTime field="dateTime" placeholder="MM-DD-YY 23:59" />
							<button className="btn btn-primary">Submit</button>
						</form>
					)}

			</Form>
			<NotesTable notes={this.props.notes} />
			</div>
		);
	}
}

AddNoteForm.defaultProps = {
	user: "LOADING"
};

AddNoteForm = createContainer(() => {
	Meteor.subscribe("notes", 5);
	Meteor.subscribe("user.preferences");
	return {
		notes: Notes.find({}, {
			sort: { createdAt: -1 },
			limit: 5
		}).fetch(),
		user: Meteor.user()
	};
}, AddNoteForm);

export default AddNoteForm;
