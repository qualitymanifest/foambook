import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { Form, Text } from "informed";
import _ from "lodash";
import { withTracker } from "meteor/react-meteor-data";
import Moment from "moment-timezone";
import { Link } from "react-router-dom";

import { Notes, NotesInsert } from "../collections/notes";
import { cleanCity, validSubRailroad, validSubCity, validSubState, validSubSymbol, validSubDateTime } from "../validation";
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
		Object.keys(valuesCopy).map(key => valuesCopy[key] = valuesCopy[key].toUpperCase());
		valuesCopy.city = cleanCity(valuesCopy.city);
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
			return (
				<div className="center">
					Please log in to submit train notes. For more information, visit the 
					<Link to="/read_me"> readme</Link>.
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
				city,
				state,
				dateTime: timezone ? Moment().tz(timezone).format("MM-DD-YY HH:mm") : ""
			};
		}

		return (
			<div className="center">
				<h3>Submit a note</h3>
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

							<div id="locationFieldSpan">
								<div id="cityField">
									<label>Location</label>
									<FieldWithError
										className="form-control"
										field="city"
										maxLength="30"
										placeholder="e.g. PITTSBURGH"
										validateOnBlur
										validate={validSubCity} />
								</div>
								<div id="stateField">
									<label>State</label>
									<FieldWithError
										className="form-control"
										field="state"
										maxLength="2"
										placeholder="E.G. PA"
										validateOnBlur
										validate={validSubState} />
								</div>
							</div>

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

							<button className="btn btn-primary">
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