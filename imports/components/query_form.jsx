import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import { connect } from "react-redux";
import Moment from "moment-timezone";
import { Form, Text } from "react-form";
import _ from "lodash";

import { Notes } from "../collections/notes";
import { changeQuery } from "../../client/actions";
import { queryValidation, cleanLocation } from "../validation";
import QueryDisplay from "./query_display";

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
		this.props.changeQuery(queryValues);
	}
	render() {
		return (
			<div className="center">
				<Form
					onSubmit={_.debounce(this.onSubmit.bind(this), 200)}
					validate={values => queryValidation(
						_.mapValues(values, val => val && typeof val === "string" ? val.toUpperCase() : null)
					)}
					defaultValues={this.props.queryState ? this.props.queryState : null}
				>
					{({ submitForm }) => (
							<form onSubmit={submitForm}>
								<div className="form-group col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 col-md-2 col-md-offset-5">
									<label>Railroad</label>
									<Text className="form-control" field="railroad" placeholder="UP | ??" />
									<label>Location</label>
									<Text className="form-control" field="location" placeholder="Tucson, AZ" />
									<label>Symbol</label>
									<Text className="form-control" field="symbol" placeholder="SYMBOL" />
									<button className="btn btn-primary btn-block">
										<span className="glyphicon glyphicon-search" />
										Search
									</button>
								</div>
							</form>
						)}
				</Form>
				<QueryDisplay notes={this.props.notes} loading={this.props.loading} uiState={this.props.uiState} />
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	// put query in state so that it will be the same when user navigates back
	return {
		changeQuery: (values) => {
			dispatch(changeQuery(values));
		}
	};
};


const MeteorQueryForm = createContainer(({ queryState }) => {
	const handle = Meteor.subscribe("notes.query", queryState);
	return {
		notes: Notes.findFromPublication("notes.query", queryState).fetch(),
		loading: !handle.ready()
	};
}, QueryForm);

export default connect(({ queryState, uiState }) => ({ queryState, uiState }), mapDispatchToProps)(MeteorQueryForm);