import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Moment from "moment-timezone";
import { connect } from "react-redux";
import _ from "lodash";
import { Link } from "react-router-dom";

import { Notes } from "../collections/notes";
import Scatterplot from "./scatterplot";
import { processNotes } from "../queryFunctions";

Moment.tz.setDefault("Etc/UTC");

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