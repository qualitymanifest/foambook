import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Form, Text } from "informed";
import _ from "lodash";
import { withTracker } from "meteor/react-meteor-data";
import Moment from "moment-timezone";

import { Notes, NotesInsert } from "../collections/notes";
import { cleanLocation, validSubRailroad, validSubLocation, validSubSymbol, validSubDateTime } from "../validation";
import DateTime from "./dateTime";
import NotesTable from "./notes_table";
import FieldWithError from "./field_with_error";

Moment.tz.setDefault("Etc/UTC");
let apiHandle;

class AddNoteForm extends Component {

	transferApi(formApi) {
		apiHandle = formApi;
	}

	onSubmit(values) {
		const valuesCopy = Object.assign({}, values);
		const cleanedLocation=cleanLocation(valuesCopy.location.toUpperCase());
		valuesCopy.railroad = valuesCopy.railroad.toUpperCase();
		valuesCopy.city = cleanedLocation.slice(0, cleanedLocation.length - 1).join(", ");
		valuesCopy.state = cleanedLocation.slice(cleanedLocation.length - 1).join(" ");
		delete valuesCopy.location;
		valuesCopy.symbol = valuesCopy.symbol.toUpperCase();
		valuesCopy.dateTime = Moment(valuesCopy.dateTime, "MM-DD-YY HH:mm").toDate();
		apiHandle.setValue("symbol", "")
		NotesInsert.call(valuesCopy, (err) => {
			if (err) {
				alert(err);
			}
		});
	}

	render() {

		if (!this.props.user) {
			// default props.user is "LOADING". if undefined, definitely not logged in.
			// using <a> instead of <Link> so that header gets rerendered - otherwise, have to bring in redux
			return (
				<div className="center">
					Please log in to submit train notes. For more information, visit the 
					<a href="/read_me"> readme</a>.
				</div>
			)
		}
		
		if (this.props.user === "LOADING") {
			return <div className="spinner" />;
		}

		let defaultValues = null;
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
					className="form-group"
					getApi={this.transferApi}
					onSubmit={_.debounce(this.onSubmit.bind(this), 200) /*slow it down in case button gets clicked twice*/}
					initialValues={defaultValues}
				>
					{({ formApi, formState }) => (
						<React.Fragment>

							<label>Railroad</label>
							<FieldWithError
								className="form-control"
								field="railroad" 
								placeholder="E.G. CSX"
								validateOnBlur
								validate={validSubRailroad}
								notify={['symbol']} />

							<label>Location</label>
							<FieldWithError
								className="form-control"
								field="location"
								placeholder="E.G. PITTSBURGH, PA"
								validateOnBlur
								validate={validSubLocation} />

							<label>Symbol</label>
							<FieldWithError
								className="form-control" 
								field="symbol" id="symbol" 
								placeholder="E.G. Q138"
								validateOnBlur
								validate={validSubSymbol}
								autoFocus />

							<label>Date/Time</label>
							<DateTime
								className="form-control" 
								field="dateTime" 
								placeholder="MM-DD-YY 23:59"
								validateOnBlur
								validate={validSubDateTime} />

							<button className="btn btn-primary btn-block">
								<span className="glyphicon glyphicon-pencil" />
								Submit
							</button>

						</React.Fragment>
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