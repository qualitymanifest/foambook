import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { ReactiveVar } from "meteor/reactive-var";
import React, { useState } from "react";

import { downloadMethod } from "../methods";
import PreferenceForm from "./preference_form";
import { Notes } from "../collections/notes";
import NotesTable from "./notes_table";
import checkUserStatus from "../utils/checkUserStatus";

const loadNum = new ReactiveVar(5);

const UserProfile = ({ user = "LOADING", notes }) => {
  const checkUser = checkUserStatus(user, "user_profile");
  if (!checkUser.shouldRender) {
    return checkUser.renderInstead;
  }
  const [downloadClicked, setDownloadClicked] = useState(false);
  return (
    <div className="text-center fadeIn">
      <h3>Default submission values</h3>
      <PreferenceForm defaultValues={user.preferences} />
      <div style={{ clear: "both" }}>
        You have submitted {user.notesCount} notes
      </div>
      <NotesTable notes={notes} user={user} caption="Your Recent Submissions" />
      {!!notes.length && (
        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => loadNum.set(loadNum.get() + 5)}
          >
            Load More
          </button>
          <br />
          <br />
          <button
            type="button"
            className={`btn btn-default ${downloadClicked && "disabled"}`}
            disabled={downloadClicked}
            onClick={downloadMethod.bind(null, setDownloadClicked)}
          >
            Download Notes
          </button>
        </>
      )}
    </div>
  );
};

export default withTracker(() => {
  Meteor.subscribe("notes.user", loadNum.get());
  return {
    // specifying userId again doesn't seem necessary but can prevent future bugs
    // see "Always use specific queries to fetch data" in guide
    user: Meteor.user(),
    notes: Notes.findFromPublication(
      "notes.user",
      { userId: Meteor.userId() },
      {
        sort: { createdAt: -1 },
        limit: loadNum.get()
      }
    ).fetch()
  };
})(UserProfile);
