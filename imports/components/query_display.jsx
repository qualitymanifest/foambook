import React from "react";
import Scatterplot from "./scatterplot";
import NotesTable from "./notes_table";
import Moment from "moment-timezone";

Moment.tz.setDefault("Etc/UTC");

const process = (notes) => {
	let oldest = Moment(notes[0].dateTime);
	let newest = Moment(notes[0].dateTime);
	const newNotes = [];
	for (let note of notes) {
		let newNote = Object.assign({}, note);
		let noteMoment = Moment(note.dateTime);
		newNote.time = (noteMoment.hours() * 60) + noteMoment.minutes()
		newNote.dateTimeReadable = Moment(note.dateTime).format("MM-DD-YY HH:mm")
		newNote.weekday = noteMoment.isoWeekday();
		newNotes.push(newNote);
		if (noteMoment < oldest) {
			oldest = noteMoment
		}
		else if (noteMoment > newest) {
			newest = noteMoment;
		}
	}
	return {notes: newNotes, oldest: oldest, newest: newest};
}

const QueryDisplay = (props) => {
	if (props.loading) {
		return <div className="spinner" />;
	}
	if (!props.notes.length) {
		return <div style={{ clear: "both" }}>There were no matches to that query</div>;
	}
	const processed = process(props.notes);
	return (
		<div>
			<Scatterplot notes={processed.notes} oldest={processed.oldest} newest={processed.newest} uiState={props.uiState} />
			<div id="dateRange">
				<p>{Moment(processed.oldest).format("MM-DD-YY")}</p>
				<p id="dateRangeColors"></p>
				<p>{Moment(processed.newest).format("MM-DD-YY")}</p>
			</div>
			<p className="smallPrint">Hover over dots for exact date/time</p>
		</div>
	);
};

export default QueryDisplay;
