import React from "react";
import Scatterplot from "./scatterplot";
import NotesTable from "./notes_table";
import Moment from "moment-timezone";

Moment.tz.setDefault("Etc/UTC");

const addInfo = (notes) => {
	const newNotes = notes.map((note) => {
		const noteMoment = Moment(note.dateTime);
		const newNote = Object.assign({}, note);
		newNote.time = (noteMoment.hours() * 60) + noteMoment.minutes()
		newNote.dateTimeReadable = Moment(note.dateTime).format("MM-DD-YY HH:mm")
		newNote.weekday = noteMoment.isoWeekday();
		return newNote;
	});
	return newNotes;
};

const QueryDisplay = (props) => {
	if (props.loading) {
		return <div className="spinner" />;
	}
	if (!props.notes.length) {
		return <div style={{ clear: "both" }}>There were no matches to that query</div>;
	}
	return (
		<Scatterplot notes={addInfo(props.notes)} uiState={props.uiState} />
	);
};

export default QueryDisplay;
