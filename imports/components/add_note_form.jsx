import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Form, Text } from "react-form";
import _ from "lodash";
import { createContainer } from "meteor/react-meteor-data";
import Moment from "moment-timezone";

//import { Notes } from "../collections/notes";
import { Notes, NotesInsert } from "../collections/notes";
import { submitValidation, cleanLocation } from "../validation";
import DateTime from "./dateTime";
import NotesTable from "./notes_table";

Moment.tz.setDefault("Etc/UTC");

class AddNoteForm extends Component {


	onSubmit(values) {
		const valuesCopy = Object.assign({}, values);
		valuesCopy.railroad = valuesCopy.railroad.toUpperCase();
		valuesCopy.location = cleanLocation(valuesCopy.location.toUpperCase());
		valuesCopy.symbol = valuesCopy.symbol.toUpperCase();
		valuesCopy.dateTime = Moment(valuesCopy.dateTime, "MM-DD-YY HH:mm").toDate();
	// clear out symbol and date fields
	// assuming user isn't constantly changing rr/loc, focus on symbol
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
			return <div>Please log in to submit train notes</div>;
		}
		if (this.props.user === "LOADING") {
			return <div id="spinner" />;
		}
		if (this.props.user.preferences) {
			// user is logged in, and has preferences. create defaults object for form!
			const { railroad, location, timezone } = this.props.user.preferences;
			defaultValues = {
				railroad,
				location: location.join(", "),
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
					_.mapValues(values, value => value && typeof value === "string" ? value.toUpperCase() : null)
				)}
			>
				{({ submitForm }) => (
						<form onSubmit={submitForm}>
							<div className="form-group col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 col-md-2 col-md-offset-5">
								<label>Railroad</label>
								<Text className="form-control" field="railroad" placeholder="UP | ??" />
								<label>Location</label>
								<Text className="form-control" field="location" placeholder="Tucson, AZ" />
								<label>Symbol</label>
								<Text className="form-control" field="symbol" id="symbol" placeholder="SYMBOL" autoFocus />
								<label>Date/Time</label>
								<DateTime className="form-control" field="dateTime" placeholder="MM-DD-YY 23:59" />
								<button className="btn btn-primary btn-block">Submit</button>
							</div>
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

const MeteorAddNoteForm = createContainer(() => {
	Meteor.subscribe("notes", 5);
	return {
		notes: Notes.findFromPublication("notes", {}, {
			sort: { createdAt: -1 },
			limit: 5
		}).fetch(),
		user: Meteor.user()
	};
}, AddNoteForm);

export default MeteorAddNoteForm;
