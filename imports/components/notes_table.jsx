import React from "react";
import Moment from "moment-timezone";
import { LinkContainer } from "react-router-bootstrap";

import FlagModal from "./flag_modal";
import { validFlag } from "../validation";

Moment.tz.setDefault("Etc/UTC");
let newest = null;

const shouldAnimate = (createdAt) => {
	if (createdAt > newest) {
		newest = createdAt;
		return "newNote";
	}
	return "";
};

const NotesTable = (props) => {
	if (!props.notes.length) return null;
	// if we're not on user_profile, initialize newest
	if (props.appLocation !== "user_profile" && !newest) {
		newest = props.notes[0].createdAt;
	}
	const renderedNotes = props.notes.map((train) => {
		const { railroad, city, state, symbol, dateTime, _id, createdAt, userId } = train;
		const noteUrl = `/?city=${city}&state=${state}&railroad=${railroad}&symbol=${symbol}`;
		return (
			<tr className={`notesTableLink ${props.appLocation === "add_note_form" ? shouldAnimate(createdAt) : ""}`}
				key={_id} 
			>
				<LinkContainer to={noteUrl}><td>{railroad}</td></LinkContainer>
				<LinkContainer to={noteUrl}><td>{city + ", " + state}</td></LinkContainer>
				<LinkContainer to={noteUrl}><td>{symbol}</td></LinkContainer>
				<LinkContainer to={noteUrl}><td>{Moment(dateTime).format("MM-DD-YY HH:mm")}</td></LinkContainer>
				{ (props.user && userId === props.user._id && props.user.status === "APPROVED") ?
					<td className="trashColumn">
						<span onClick={() => props.deleteFunc(_id)}
							className="glyphicon glyphicon-trash"
						/>
					</td>
					: props.user && props.user.status === "APPROVED" ?
					<FlagModal _id={_id} type="note" validationFunc={validFlag} />
					: ""
				}
			</tr>
		);
	});
	return (
		<table className="table table-striped table-condensed table-responsive fadeIn">
			<caption className="text-center">{props.caption}</caption>
			<thead>
				<tr>
					<th>RR</th>
					<th>Location</th>
					<th>Symbol</th>
					<th>Date/Time</th>
					<th className="trashColumn" />
				</tr>
			</thead>
			<tbody>
				{renderedNotes}
			</tbody>
		</table>
	);
};

export default NotesTable;
