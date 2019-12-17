import React, { useState, lazy, Suspense } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import {
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";

import { Notes } from "../collections/notes";
import { Comments } from "../collections/comments";
import Info from "../collections/info";
import Scatterplot from "./scatterplot";
import CommentsForm from "./comments_form";
import InfoDisplay from "./info_display";
import { processNotes } from "../utils/queryFunctions";
import { QUERY_NOT_FOUND, DATETIME_FORMAT_SHORT } from "../utils/constants";

const CommentsList = lazy(() => import("./comments_list"));

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
  const { processedNotes, processedYears } = processNotes(notes);
  let oldest = processedNotes[0].luxonDateTime;
  let newest = processedNotes[processedNotes.length - 1].luxonDateTime;
  let filteredNotes = null;
  if (processedYears.length) {
    // Add a 0 so that filter can be unset by making filterYear falsy
    // Render associated togglebutton as "all"
    processedYears.unshift(0);
  }
  if (filterYear) {
    filteredNotes = processedNotes.filter(note => note.year == filterYear); // eslint-disable-line
    oldest = filteredNotes[0].luxonDateTime;
    newest = filteredNotes[filteredNotes.length - 1].luxonDateTime;
  }
  return (
    <div className="text-center fadeIn">
      {processedYears.length > 1 && (
        <ButtonToolbar className="buttonToolbar">
          <ToggleButtonGroup type="radio" name="sortType" defaultValue={0}>
            {processedYears.map(year => {
              return (
                <ToggleButton
                  className="toggleButton"
                  key={year}
                  value={year}
                  onClick={() => setFilterYear(year)}
                >
                  {year || "All"}
                </ToggleButton>
              );
            })}
          </ToggleButtonGroup>
        </ButtonToolbar>
      )}
      <Scatterplot
        notes={filteredNotes || processedNotes}
        oldest={oldest}
        newest={newest}
      />
      <small>Date range:</small>
      <div id="dateRange">
        <p>{oldest.toFormat(DATETIME_FORMAT_SHORT)}</p>
        <p id="dateRangeColors" />
        <p>{newest.toFormat(DATETIME_FORMAT_SHORT)}</p>
      </div>
      <small>Hover or tap dots for exact date/time</small>
      {/* Since info goes on top of comments, make sure it is ready before rendering either */
      infoReady && (
        <>
          <InfoDisplay info={info} query={query} />
          <CommentsForm user={user} query={query} />
          <Suspense fallback={<div />}>
            <CommentsList
              user={user}
              comments={comments}
              city={query.city}
              state={query.state}
            />
          </Suspense>
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
