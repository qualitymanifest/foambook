import React from "react";
import _ from "lodash";
import Moment from "moment-timezone";
import { Form, Text, Select } from "react-form";

import { preferenceValidation } from "../validation";

const moment = Moment();

export default (props) => {
	return (
		<Form
			onSubmit={props.onSubmit}
			defaultValues={props.defaultValues}
			validate={values => preferenceValidation(
				_.mapValues(values, val => val && typeof val === "string" ? val.toUpperCase() : null)
			)}
		>
			{({ submitForm }) => (
				<form onSubmit={submitForm}>
					<div className="form-group col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 col-md-2 col-md-offset-5">
						<label>Default Railroad</label>
						<Text className="form-control" field="railroad" placeholder="E.G. CSX" />
						<label>Default Location</label>
						<Text className="form-control" field="location" placeholder="E.G. PITTSBURGH, PA" />
						<label>Default Timezone</label>
						<Select
							className="form-control"
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
							}, {
								label: `AST: ${moment.tz("America/Moncton").format("MM-DD-YY HH:mm")}`,
								value: "America/Moncton"
							}, {
								label: "None",
								value: ""
							}
							]}
						/>
						<button className="btn btn-warning btn-block">Change Preferences</button>
					</div>
				</form>
			)}
		</Form>
	);
};
