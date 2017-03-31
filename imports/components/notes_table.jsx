import React from "react";
import moment from "moment-timezone";

moment.tz.setDefault("Etc/UTC");

const NotesTable = (props) => {
	if (!props.notes.length) return null;
	const renderedNotes = props.notes.map((train) => {
		const { railroad, location, symbol, dateTime, _id } = train;
		return (
			<tr key={_id}>
				<td>{railroad}</td>
				<td>{location.join(", ")}</td>
				<td>{symbol}</td>
				<td>{moment(dateTime).format("MM-DD-YY HH:mm")}</td>
				{props.deleteFunc && 
					<td>
						<span onClick={() => props.deleteFunc(_id)} className="glyphicon glyphicon-trash" />
					</td>}
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
