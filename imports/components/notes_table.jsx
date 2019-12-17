import React from "react";
import { DateTime, Settings } from "luxon";
import { LinkContainer } from "react-router-bootstrap";

import { notesDeleteMethod } from "../methods";
import { DATETIME_FORMAT, TZ_DEFAULT } from "../utils/constants";
import FlagTrash from "./flag_trash";

Settings.defaultZoneName = TZ_DEFAULT;
let newest = null;

const shouldAnimate = createdAt => {
  if (createdAt > newest) {
    newest = createdAt;
    return "newNote";
  }
  return "";
};

const NotesTable = ({ notes, appLocation, user, caption }) => {
  if (!notes.length) return null;
  // if we're not on user_profile, initialize newest
  if (appLocation !== "user_profile" && !newest) {
    newest = notes[0].createdAt;
  }
  const renderedNotes = notes.map(note => {
    const {
      railroad,
      city,
      state,
      symbol,
      dateTime,
      _id,
      createdAt,
      userId
    } = note;
    const noteUrl = `/?city=${city}&state=${state}&railroad=${railroad}&symbol=${symbol}`;
    return (
      <tr
        className={`notesTableLink ${
          appLocation === "add_note_form" ? shouldAnimate(createdAt) : ""
        }`}
        key={_id}
      >
        <LinkContainer to={noteUrl}>
          <td>{railroad}</td>
        </LinkContainer>
        <LinkContainer to={noteUrl}>
          <td>{`${city}, ${state}`}</td>
        </LinkContainer>
        <LinkContainer to={noteUrl}>
          <td>{symbol}</td>
        </LinkContainer>
        <LinkContainer to={noteUrl}>
          <td>{DateTime.fromJSDate(dateTime).toFormat(DATETIME_FORMAT)}</td>
        </LinkContainer>
        <td>
          <FlagTrash
            currentUser={user}
            dbUserId={userId}
            docId={_id}
            deleteHandler={notesDeleteMethod}
            type="note"
          />
        </td>
      </tr>
    );
  });
  return (
    <table className="table table-striped table-condensed table-responsive fadeIn">
      <caption className="text-center">{caption}</caption>
      <thead>
        <tr>
          <th>RR</th>
          <th>Location</th>
          <th>Symbol</th>
          <th>Date/Time</th>
          <th className="trashColumn" />
        </tr>
      </thead>
      <tbody>{renderedNotes}</tbody>
    </table>
  );
};

export default NotesTable;
