import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import { Notes } from "../collections/notes";
import { Comments } from "../collections/comments";
import Info from "../collections/info";
import Scatterplot from "./scatterplot";
import CommentsForm from "./comments_form";
import CommentsList from "./comments_list";
import InfoDisplay from "./info_display";
import { processNotes } from "../utils/queryFunctions";
import { QUERY_NOT_FOUND, DATETIME_FORMAT_SHORT } from "../utils/constants";

const QueryDisplay = ({
  notesReady,
  notes,
  query,
  info,
  infoReady,
  user,
  comments
}) => {
  if (!notesReady) {
    return <div className="spinner" />;
  }
  if (!notes.length) {
    return <div style={{ clear: "both" }}>{QUERY_NOT_FOUND}</div>;
  }
  const [filterYear, setFilterYear] = useState(null);
  const processed = processNotes(notes);
  let filtered = null;
  if (filterYear) {
    filtered = processed.notes.filter(note => note.year == filterYear); // eslint-disable-line
  }
  return (
    <div className="text-center fadeIn">
      {processed.years.length > 1 && (
        <div>
          <span>Filter by year:</span>
          {processed.years.map(year => {
            return (
              <button
                type="button"
                className="queryFilterOption"
                key={year}
                onClick={() => setFilterYear(year)}
              >
                {year}
              </button>
            );
          })}
        </div>
      )}
      <Scatterplot
        notes={filtered || processed.notes}
        oldest={processed.oldest}
        newest={processed.newest}
      />
      <small>Date range:</small>
      <div id="dateRange">
        <p>{processed.oldest.toFormat(DATETIME_FORMAT_SHORT)}</p>
        <p id="dateRangeColors" />
        <p>{processed.newest.toFormat(DATETIME_FORMAT_SHORT)}</p>
      </div>
      <small>Hover or tap dots for exact date/time</small>
      {/* Since info goes on top of comments, make sure it is ready before rendering either */
      infoReady && (
        <>
          <InfoDisplay info={info} query={query} />
          <CommentsForm user={user} query={query} />
          <CommentsList
            user={user}
            comments={comments}
            city={query.city}
            state={query.state}
          />
        </>
      )}
    </div>
  );
};

export default withTracker(({ query }) => {
  const notesHandle = Meteor.subscribe("notes.query", query);
  const commentsQuery = { railroad: query.railroad, symbol: query.symbol };
  Meteor.subscribe("comments", commentsQuery);
  const infoQuery = { _id: `${query.railroad}_${query.symbol}` };
  const infoHandle = Meteor.subscribe("info", infoQuery);
  return {
    notes: Notes.findFromPublication("notes.query", query, {
      fields: { dateTime: 1 },
      sort: { dateTime: 1 }
    }).fetch(),
    notesReady: notesHandle.ready(),
    info: Info.findFromPublication("info", infoQuery).fetch(),
    infoReady: infoHandle.ready(),
    user: Meteor.user(),
    comments: Comments.findFromPublication("comments", commentsQuery, {
      sort: { createdAt: -1 }
    }).fetch()
  };
})(QueryDisplay);
