import React from "react";
import { debounce } from "lodash";
import Moment from "moment-timezone";
import { Form, Select, Option } from "informed";

import { preferenceSubmitMethod } from "../methods";
import {
  validPrefRailroad,
  validPrefCity,
  validPrefState
} from "../utils/validation";
import {
  MAX_STATE_LEN,
  MAX_CITY_LEN,
  FORM_DEBOUNCE_MS,
  DATETIME_FORMAT
} from "../utils/constants";
import FieldWithError from "./field_with_error";

const moment = Moment();

export default ({ defaultValues }) => {
  return (
    <Form
      className="form-group"
      onSubmit={debounce(preferenceSubmitMethod, FORM_DEBOUNCE_MS)}
      initialValues={defaultValues}
    >
      {() => (
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
                maxLength={MAX_CITY_LEN}
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
                maxLength={MAX_STATE_LEN}
                placeholder="E.G. PA"
                validateOnBlur
                validate={validPrefState}
              />
            </div>
          </div>

          <label>Timezone</label>
          <Select className="form-control" field="timezone">
            <Option value="" />
            <Option value="America/Los_Angeles">
              {`PST: ${moment
                .tz("America/Los_Angeles")
                .format(DATETIME_FORMAT)}`}
            </Option>
            <Option value="America/Phoenix">
              {`AZ: ${moment.tz("America/Phoenix").format(DATETIME_FORMAT)}`}
            </Option>
            <Option value="America/Denver">
              {`MST: ${moment.tz("America/Denver").format(DATETIME_FORMAT)}`}
            </Option>
            <Option value="America/Chicago">
              {`CST: ${moment.tz("America/Chicago").format(DATETIME_FORMAT)}`}
            </Option>
            <Option value="America/New_York">
              {`EST: ${moment.tz("America/New_York").format(DATETIME_FORMAT)}`}
            </Option>
            <Option value="America/Moncton">
              {`AST: ${moment.tz("America/Moncton").format(DATETIME_FORMAT)}`}
            </Option>
          </Select>

          <button type="submit" className="btn btn-warning">
            Set Defaults
          </button>
        </>
      )}
    </Form>
  );
};
