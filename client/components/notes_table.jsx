import React from "react";
import moment from "moment-timezone";

moment.tz.setDefault("Etc/UTC");

const NotesTable = (props) => {
	if (!props.notes.length) return null;
	const renderedNotes = props.notes.map((train, idx) => {
		const { railroad, location, symbol, dateTime } = train;
		return (
			<tr key={idx}>
				<td>{railroad}</td>
				<td>{location.join(" ")}</td>
				<td>{symbol}</td>
				<td>{moment(dateTime).format("MM-DD-YY HH:mm") }</td>
				{props.deleteFunc && <td><span className="glyphicon glyphicon-trash"/></td>}
			</tr>
		);
	});
	return (
		<table className="table table-striped table-condensed">
			<thead>
				<tr>
					<th>RR</th>
					<th>Location</th>
					<th>Symbol</th>
					<th>Date/Time</th>
					{props.deleteFunc && <th>Delete?</th>}
				</tr>
			</thead>
			<tbody>
				{renderedNotes}
			</tbody>
		</table>
	);
};

export default NotesTable;
