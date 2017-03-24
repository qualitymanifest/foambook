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
		if (!this.props.user) { return <div>Please log in to submit train notes</div>; }
		return (
			<div className="center">
			<Form
				onSubmit={_.debounce(this.onSubmit.bind(this), 200)}
				defaultValues={{
					railroad: "UP",
					location: "TUCSON, AZ",
					symbol: "QEWWC",
					dateTime: Moment().tz("America/Phoenix").format("MM-DD-YY HH:mm") }}
				/* input values aren't really uppercase, its just the css. i was previously
				using prevalidate to uppercase, but that ran the function on every keystroke and would
				move the text cursor if you tried to update the middle of the word. */
				validate={values => submitValidation(
					_.mapValues(values, value => value ? value.toUpperCase() : null)
				)}
			>
				{({ submitForm }) => (
						<form onSubmit={submitForm}>
							<label>Railroad reporting marks</label>
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

AddNoteForm = createContainer(() => {
	Meteor.subscribe("notes", 5);
	Meteor.subscribe("user.preferences");
	return {
		notes: Notes.find({}, {
			sort: { createdAt: -1 },
			limit: 5
		}).fetch(),
		user: Meteor.user(),
		preferences: Meteor.users.findOne({_id: Meteor.userId()}, {fields : {preferences: 1}})
	};
}, AddNoteForm);

export default AddNoteForm;
