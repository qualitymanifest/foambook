import React from "react";
import _ from "lodash";
import Moment from "moment-timezone";
import { Form, Text, Select, Option } from "informed";

import FieldWithError from "./field_with_error";
import { validPrefRailroad, validPrefLocation } from "../validation";

const moment = Moment();

export default (props) => {
	return (
		<Form
			className="form-group"
			onSubmit={props.onSubmit}
			initialValues={props.defaultValues}
		>
			{({ formApi, formState }) => (
				<React.Fragment>

					<label>Default Railroad</label>
					<FieldWithError 
						className="form-control"
						field="railroad" 
						placeholder="E.G. CSX"
						validateOnBlur
						validate={validPrefRailroad} />

					<label>Default Location</label>
					<FieldWithError 
						className="form-control" 
						field="location" 
						placeholder="E.G. PITTSBURGH, PA"
						validateOnBlur
						validate={validPrefLocation} />
					
					<label>Default Timezone</label>
					<Select
						className="form-control"
						field="timezone"
					>

						<Option value="">
						</Option>

						<Option value="America/Los_Angeles">
						 {`PST: ${moment.tz("America/Los_Angeles").format("MM-DD-YY HH:mm")}`}
						</Option>

						<Option value="America/Phoenix">
						 {`AZ: ${moment.tz("America/Phoenix").format("MM-DD-YY HH:mm")}`}
						</Option>

						<Option value="America/Denver">
						 {`MST: ${moment.tz("America/Denver").format("MM-DD-YY HH:mm")}`}
						</Option>

						<Option value="America/Chicago">
						 {`CST: ${moment.tz("America/Chicago").format("MM-DD-YY HH:mm")}`}
						</Option>

						<Option value="America/New_York">
						 {`EST: ${moment.tz("America/New_York").format("MM-DD-YY HH:mm")}`}
						</Option>

						<Option value="America/Moncton">
						 {`AST: ${moment.tz("America/Moncton").format("MM-DD-YY HH:mm")}`}
						</Option>

					</Select>

					<button className="btn btn-warning btn-block">Set Defaults</button>
					
				</React.Fragment>
			)}
		</Form>
	);
};