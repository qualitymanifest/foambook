import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import Moment from "moment-timezone";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Notes } from "../collections/notes";
import { Comments } from "../collections/comments";
import { Info } from "../collections/info";
import Scatterplot from "./scatterplot";
import CommentsForm from "./comments_form";
import CommentsList from "./comments_list";
import InfoDisplay from "./info_display";
import { processNotes } from "../utils/queryFunctions";
import { QUERY_NOT_FOUND } from "../utils/constants";

Moment.tz.setDefault("Etc/UTC");

const QueryDisplay = ({ notesReady, notes, query, uiState, info, infoReady, user, comments }) => {
	if (!notesReady) {
		return <div className="spinner" />
	}
	if (!notes.length) {
		return <div style={{ clear: "both" }}>{QUERY_NOT_FOUND}</div>;
	}
	const processed = processNotes(notes);
	return (
		<div className="text-center fadeIn">
			{processed.years.length > 1 ?
				<div>
					Filter by year:
						{processed.years.map((year) => {
						return (
							<Link className="queryFilterOption" key={year}
								to={`?city=${query.city}&state=${query.state}&railroad=${query.railroad}&symbol=${query.symbol}&year=${year}`}
							>
								{`  ${year}  `}
							</Link>
						)
					})
					}
				</div>
				: ""
			}
			<Scatterplot notes={processed.notes} oldest={processed.oldest} newest={processed.newest} uiState={uiState} />
			<small>Date range:</small>
			<div id="dateRange">
				<p>{Moment(processed.oldest).format("MM-DD-YY")}</p>
				<p id="dateRangeColors"></p>
				<p>{Moment(processed.newest).format("MM-DD-YY")}</p>
			</div>
			<small>Hover or tap dots for exact date/time</small>
			{
				/* Since info goes on top of comments, make sure it is ready before rendering either */
				infoReady &&
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
			}
		</div>
	);
};


export default connect(({ uiState }) => ({ uiState }))(
	withTracker(({ query }) => {
		const notesHandle = Meteor.subscribe("notes.query", query);
		const commentsQuery = { railroad: query.railroad, symbol: query.symbol };
		Meteor.subscribe("comments", commentsQuery);
		const infoQuery = { _id: `${query.railroad}_${query.symbol}` };
		const infoHandle = Meteor.subscribe("info", infoQuery);
		return {
			notes: Notes.findFromPublication("notes.query", query, { fields: { dateTime: 1 }, sort: { dateTime: 1 } }).fetch(),
			notesReady: notesHandle.ready(),
			info: Info.findFromPublication("info", infoQuery).fetch(),
			infoReady: infoHandle.ready(),
			user: Meteor.user(),
			comments: Comments.findFromPublication("comments", commentsQuery, { sort: { createdAt: -1 } }).fetch(),
		};
	})(QueryDisplay)
);
