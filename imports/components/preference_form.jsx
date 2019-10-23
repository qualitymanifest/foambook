import React from "react";
import { debounce } from "lodash";
import Moment from "moment-timezone";
import { Form, Select, Option } from "informed";

import FieldWithError from "./field_with_error";
import { validPrefRailroad, validPrefCity, validPrefState } from "../validation";

const moment = Moment();

export default (props) => {
	return (
		<Form
			className="form-group"
			onSubmit={debounce(props.onSubmit, 200)}
			initialValues={props.defaultValues}
		>
			{({ formApi, formState }) => (
				<>

					<label>Railroad</label>
					<FieldWithError
						className="form-control"
						field="railroad"
						placeholder="E.G. CSX"
						validateOnBlur
						validate={validPrefRailroad}
					/>

					<div id="locationFieldSpan">
						<div id="cityField">
							<label>Location</label>
							<FieldWithError
								className="form-control"
								field="city"
								maxLength="30"
								placeholder="e.g. PITTSBURGH"
								validateOnBlur
								validate={validPrefCity}
							/>
						</div>
						<div id="stateField">
							<label>State</label>
							<FieldWithError
								className="form-control"
								field="state"
								maxLength="2"
								placeholder="E.G. PA"
								validateOnBlur
								validate={validPrefState}
							/>
						</div>
					</div>

					<label>Timezone</label>
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

					<button className="btn btn-warning">Set Defaults</button>

				</>
			)}
		</Form>
	);
};
