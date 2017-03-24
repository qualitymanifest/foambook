import React from 'react';
import _ from "lodash";
import Moment from 'moment-timezone';
import { Form, Text, Select } from "react-form";
import { preferenceValidation } from '../../imports/validation';

const moment = Moment();

export default (props) => {
	return (
		<Form
			onSubmit={props.onSubmit}
			validate={values => preferenceValidation(
				_.mapValues(values, value => value ? value.toUpperCase() : null)
			)}
		>
			{({ submitForm }) => (
				<form onSubmit={submitForm}>
					<label>Default Railroad</label>
					<Text field="railroad" placeholder="RAILROAD" />
					<label>Default Location</label>
					<Text field="location" placeholder="LOCATION" />
					<label>Default Timezone</label>
					<Select
						className="form-control select"
						field="timezone"
						options={[{
							label: `PST: ${moment.tz("America/Los_Angeles").format("MM-DD-YY HH:mm")}`,
							value: "America/Los_Angeles"
						}, {
							label: `AZ: ${moment.tz("America/Phoenix").format("MM-DD-YY HH:mm")}`,
							value: "America/Phoenix"
						}, {
							label: `MST: ${moment.tz("America/Denver").format("MM-DD-YY HH:mm")}`,
							value: "America/Denver"
						}, {
							label: `CST: ${moment.tz("America/Chicago").format("MM-DD-YY HH:mm")}`,
							value: "America/Chicago"
						}, {
							label: `EST: ${moment.tz("America/New_York").format("MM-DD-YY HH:mm")}`,
							value: "America/New_York"
						}]}
					/>
					<button className="btn btn-warning">Submit Changes</button>
				</form>
			)}
		</Form>
	)
}