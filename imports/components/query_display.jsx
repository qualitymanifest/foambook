import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Moment from "moment-timezone";
import { connect } from "react-redux";
import _ from "lodash";
import { Link } from "react-router-dom";

import { Notes } from "../collections/notes";
import Scatterplot from "./scatterplot";

Moment.tz.setDefault("Etc/UTC");

const processNotes = (notes) => {
	let oldest = Moment(notes[0].dateTime);
	let newest = Moment(notes[0].dateTime);
	let years = [];
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
		if (!years.includes(noteMoment.year())) {
			years.push(noteMoment.year());
		}
	}
	return {notes: newNotes, oldest: oldest, newest: newest, years: years.sort()};
}

class QueryDisplay extends Component {
	render() {
		if (this.props.notesLoading) {
			return <div className="spinner" />;
		}
		if (!this.props.notes.length) {
			return <div style={{ clear: "both" }}>There were no matches to that query</div>;
		}
		const processed = processNotes(this.props.notes);
		let query = this.props.query;
		return (
			<div className="center">
				{ processed.years.length > 1 ? 
					<div>
						Filter by year:
							{ processed.years.map((year) => {
								return (
									<Link key={year}
										to={`?city=${query.city}&state=${query.state}&railroad=${query.railroad}&symbol=${query.symbol}&begin=01-${year}&end=12-${year}`}
									>
										{`  ${year}  `}
									</Link>
								)
							})
						}
					</div>
					: null
				}
				<Scatterplot notes={processed.notes} oldest={processed.oldest} newest={processed.newest} uiState={this.props.uiState} />
				{ processed.notes.length > 1 && 
					<div id="dateRange">
						<p>{Moment(processed.oldest).format("MM-DD-YY")}</p>
						<p id="dateRangeColors"></p>
						<p>{Moment(processed.newest).format("MM-DD-YY")}</p>
					</div>
				}
				<p className="smallPrint">If you're on a computer, you can hover over dots for exact date/time</p>
			</div>
		);
	}
};


QueryDisplay = withTracker(({ query }) => {
	const notesHandle = Meteor.subscribe("notes.query", query);
	return {
		notes: Notes.findFromPublication("notes.query", query, { fields: { dateTime: 1 } }).fetch(),
		notesLoading: !notesHandle.ready()
	};
})(QueryDisplay);

export default connect(({ uiState }) => ({ uiState }))(QueryDisplay);