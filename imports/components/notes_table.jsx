import React from "react";
import { DateTime, Settings } from "luxon";
import { LinkContainer } from "react-router-bootstrap";

import { notesDeleteMethod } from "../methods";
import { DATETIME_FORMAT, TZ_DEFAULT } from "../utils/constants";
import FlagTrash from "./flag_trash";

Settings.defaultZoneName = TZ_DEFAULT;
let newest = null;

const shouldAnimate = createdAt => {
  if (newest && createdAt > newest) {
    newest = createdAt;
    return "newNote";
  }
  return "";
};

const NotesTable = ({ notes, appLocation, user, caption }) => {
  if (!notes.length) return null;
  if (appLocation === "add_note_form" && !newest) {
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
      <tr className={shouldAnimate(createdAt)} key={_id}>
        <LinkContainer to={noteUrl}>
          <td className="notesTableLink">{railroad}</td>
        </LinkContainer>
        <LinkContainer to={noteUrl}>
          <td className="notesTableLink">{`${city}, ${state}`}</td>
        </LinkContainer>
        <LinkContainer to={noteUrl}>
          <td className="notesTableLink">{symbol}</td>
        </LinkContainer>
        <td>{DateTime.fromJSDate(dateTime).toFormat(DATETIME_FORMAT)}</td>
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
