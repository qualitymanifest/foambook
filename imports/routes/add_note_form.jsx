import { Meteor } from "meteor/meteor";
import React from "react";
import { Form } from "informed";
import { debounce } from "lodash";
import { withTracker } from "meteor/react-meteor-data";
import { DateTime, Settings } from "luxon";

import { noteSubmitMethod } from "../methods";
import { Notes } from "../collections/notes";
import {
  validSubRailroad,
  validSubCity,
  validSubState,
  validSubSymbol,
  validSubDateTime
} from "../utils/validation";
import {
  MAX_STATE_LEN,
  MAX_CITY_LEN,
  FORM_DEBOUNCE_MS,
  DATETIME_FORMAT,
  TZ_DEFAULT
} from "../utils/constants";
import DateTimeField from "../components/dateTime";
import NotesTable from "../components/notes_table";
import FieldWithError from "../components/field_with_error";
import checkUserStatus from "../utils/checkUserStatus";

Settings.defaultZoneName = TZ_DEFAULT;
let apiHandle;

const AddNoteForm = ({ notes, user = "LOADING" }) => {
  const checkUser = checkUserStatus(user, "add_note_form");
  if (!checkUser.shouldRender) {
    return checkUser.renderInstead;
  }

  const { railroad, city, state, timezone } = user.preferences;

  const defaultValues = {
    railroad,
    city,
    state,
    dateTime: timezone
      ? DateTime.fromObject({ zone: timezone }).toFormat(DATETIME_FORMAT)
      : ""
  };

  const onSubmit = values => noteSubmitMethod(values, apiHandle);

  const transferApi = formApi => {
    apiHandle = formApi;
  };

  return (
    <div className="text-center fadeIn">
      <h3>Submit a note</h3>
      <Form
        className="form-group"
        getApi={transferApi}
        onSubmit={debounce(onSubmit, FORM_DEBOUNCE_MS)}
        initialValues={defaultValues}
      >
        {(
          { formApi, formState } // eslint-disable-line
        ) => (
          <>
            <label>Railroad</label>
            <FieldWithError
              className="form-control"
              field="railroad"
              placeholder="E.G. CSX"
              validateOnBlur
              validate={validSubRailroad}
              notify={["symbol"]}
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
                  validate={validSubCity}
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
                  validate={validSubState}
                />
              </div>
            </div>

            <label>Symbol</label>
            <FieldWithError
              className="form-control"
              field="symbol"
              id="symbol"
              placeholder="E.G. Q138"
              validateOnBlur
              validate={validSubSymbol}
              autoFocus
            />

            <label>Date/Time</label>
            <DateTimeField
              className="form-control"
              field="dateTime"
              placeholder="MM-DD-YY 23:59"
              validateOnBlur
              validate={validSubDateTime}
            />

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </>
        )}
      </Form>
      <NotesTable
        notes={notes}
        user={user}
        caption="Recent Submissions - All Users"
      />
    </div>
  );
};

export default withTracker(() => {
  Meteor.subscribe("notes", 5);
  return {
    notes: Notes.findFromPublication(
      "notes",
      {},
      {
        sort: { createdAt: -1 },
        limit: 5
      }
    ).fetch(),
    user: Meteor.user()
  };
})(AddNoteForm);
