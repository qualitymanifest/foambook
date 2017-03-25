import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { connect } from "react-redux";
import Moment from "moment-timezone";
import { Form, Text } from "react-form";
import _ from "lodash";

import { Notes } from "../../imports/collections/notes";
import { changeQuery } from "../actions";
import NotesTable from "./notes_table";
import { queryValidation, cleanLocation } from "../../imports/validation";
import Scatterplot from './scatterplot';

//Moment.tz.setDefault("Etc/UTC");
let M = Moment();
console.log(M.isoWeekday());
console.log(M.format("HHmm"));


class QueryForm extends Component {

	onSubmit(values) {
		// temp solution for uppercasing values and not including them if
		// they are an empty string
		const queryValues = {};
		if (values.railroad) {
			queryValues.railroad = values.railroad.toUpperCase();
		}
		if (values.location) {
			queryValues.location = cleanLocation(values.location.toUpperCase());
		}
		if (values.symbol) {
			queryValues.symbol = values.symbol.toUpperCase();
		}
		// temp solution for making sure omitting values doesnt show entire collection
		if (_.values(queryValues).length === 0) {
			queryValues.railroad = null;
		}
		this.props.changeQuery(queryValues);
	}
	render() {
		return (
			<div className="center">
				<Form
					onSubmit={_.debounce(this.onSubmit.bind(this), 200)}
					validate={values => queryValidation(
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
								<Text field="symbol" placeholder="SYMBOL" />
								<button className="btn btn-primary">Search</button>
							</form>
						)}
				</Form>
				<Scatterplot notes={this.props.notes} />
				<NotesTable notes={this.props.notes} />
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeQuery: (values) => {
			dispatch(changeQuery(values));
		}
	};
};


const MeteorQueryForm = createContainer(({ queryState }) => {
	console.log(queryState)
	Meteor.subscribe("query.notes", queryState);
	return {
		notes: Notes.find(queryState).fetch()
	};
}, QueryForm);


export default connect(({ queryState }) => ({ queryState }), mapDispatchToProps)(MeteorQueryForm);