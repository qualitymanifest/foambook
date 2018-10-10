import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Moment from "moment-timezone";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Notes } from "../collections/notes";
import { Comments } from "../collections/comments";
import Scatterplot from "./scatterplot";
import CommentsForm from "./comments_form";
import CommentsList from "./comments_list";
import { processNotes } from "../queryFunctions";

Moment.tz.setDefault("Etc/UTC");

class QueryDisplay extends Component {
	render() {
		if (!this.props.notesReady) {
			return <div className="spinner" />;
		}
		if (!this.props.notes.length) {
			return <div style={{ clear: "both" }}>There were no results to that query. Not sure how you got here - maybe you followed a bad link?</div>;
		}

		const processed = processNotes(this.props.notes);
		let query = this.props.query;
		return (
			<div className="center fadeIn">
				{ processed.years.length > 1 ? 
					<div>
						Filter by year:
							{ processed.years.map((year) => {
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
				<Scatterplot notes={processed.notes} oldest={processed.oldest} newest={processed.newest} uiState={this.props.uiState} />
				<p className="smallPrint">If you're on a computer, you can hover over dots to see exact date/time</p>
				<div>
					<p className="smallPrint">Dot color indicates age: Gray are oldest, red are newest. Date range:</p>
					<div id="dateRange">
						<p>{Moment(processed.oldest).format("MM-DD-YY")}</p>
						<p id="dateRangeColors"></p>
						<p>{Moment(processed.newest).format("MM-DD-YY")}</p>
					</div>
				</div>
				<CommentsForm user={this.props.user} query={query} />
				<CommentsList 
					user={this.props.user} 
					comments={this.props.comments} 
					commentsReady={this.props.commentsReady} 
					city={this.props.query.city}
					state={this.props.query.state}
				/>
			</div>
		);
	}
}


QueryDisplay = withTracker(({ query }) => {
	const notesHandle = Meteor.subscribe("notes.query", query);
	const commentsQuery = { railroad: query.railroad, symbol: query.symbol };
	const commentsHandle = Meteor.subscribe("comments", commentsQuery);
	return {
		notes: Notes.findFromPublication("notes.query", query, { fields: { dateTime: 1 }, sort: { dateTime: 1 } }).fetch(),
		notesReady: notesHandle.ready(),
		user: Meteor.user(),
		comments: Comments.findFromPublication("comments", commentsQuery, { sort: { createdAt: -1 } }).fetch(),
		commentsReady: commentsHandle.ready()
	};
})(QueryDisplay);

export default connect(({ uiState }) => ({ uiState }))(QueryDisplay);
