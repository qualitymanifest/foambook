import React from "react";
import { debounce } from "lodash";
import { DateTime } from "luxon";
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
  DATETIME_FORMAT,
  ZONES
} from "../utils/constants";
import FieldWithError from "./field_with_error";

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
            <Option value={ZONES.PST}>
              {`PST: ${DateTime.fromObject({ zone: ZONES.PST }).toFormat(
                DATETIME_FORMAT
              )}`}
            </Option>
            <Option value={ZONES.AZ}>
              {`AZ: ${DateTime.fromObject({ zone: ZONES.AZ }).toFormat(
                DATETIME_FORMAT
              )}`}
            </Option>
            <Option value={ZONES.MST}>
              {`MST: ${DateTime.fromObject({ zone: ZONES.MST }).toFormat(
                DATETIME_FORMAT
              )}`}
            </Option>
            <Option value={ZONES.CST}>
              {`CST: ${DateTime.fromObject({ zone: ZONES.CST }).toFormat(
                DATETIME_FORMAT
              )}`}
            </Option>
            <Option value={ZONES.EST}>
              {`EST: ${DateTime.fromObject({ zone: ZONES.EST }).toFormat(
                DATETIME_FORMAT
              )}`}
            </Option>
            <Option value={ZONES.AST}>
              {`AST: ${DateTime.fromObject({ zone: ZONES.AST }).toFormat(
                DATETIME_FORMAT
              )}`}
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
