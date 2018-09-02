import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Moment from "moment-timezone";

import { AggregateLocations } from "../collections/aggregations";
import QueryDisplay from "./query_display";
import QuerySymbols from "./query_symbols";
import { locationSorter, listLocations, testLocation, breadcrumbBuilder } from "../queryFunctions";

let completeQuery = {};

class Query extends Component {
	render() {
		
		if (!this.props.aggregateLocationsReady) {
			return <div className="spinner" />;
		}

		let aggregateLocations = locationSorter(this.props.aggregateLocations);
		let qString = queryString.parse(location.search);

		if (qString.city && qString.state && qString.railroad && qString.symbol) {
			// completeQuery is for sending into DB - not using raw query string in case errant values are present
			completeQuery = {city: qString.city, state: qString.state, railroad: qString.railroad, symbol: qString.symbol}
			let invalidDate = false;
			if (qString.year) {
				invalidDate = !/^\d{4}$/.test(qString.year);
				let begin = Moment(qString.year, "YYYY").startOf("year").toDate()
				let end = Moment(qString.year, "YYYY").endOf("year").toDate();
				// throw dateTime in regardless so we know if we have to render date in breadcrumb
				completeQuery.dateTime = {"$gte": begin, "$lte": end}
			}
			let locationsTested = testLocation(aggregateLocations, qString.city, qString.state);
				return (
				<div className="center">
					{ completeQuery.dateTime ? breadcrumbBuilder(qString, "dates") : breadcrumbBuilder(qString, "symbol") }
					{ 
						invalidDate ? "Sorry, invalid year specified" :
						(typeof locationsTested === "string") ? locationsTested : <QueryDisplay query={completeQuery} /> 
					}
				</div>
			)
		}

		if (qString.city && qString.state) {
			let locationsTested = testLocation(aggregateLocations, qString.city, qString.state);
			return (
				<div className="center">
					{ breadcrumbBuilder(qString, "city") }
					{ (typeof locationsTested === "string") ? locationsTested : <QuerySymbols city={qString.city} state={qString.state}/> }
				</div>
			)
		}

		return (
			<div className="center">
				<Breadcrumb>
					<Breadcrumb.Item active>Search Home</Breadcrumb.Item>
				</Breadcrumb>
				{ listLocations(aggregateLocations) }
			</div>
		)		

	}
}



Query = withTracker(() => {
	const aggregateLocationsHandle = Meteor.subscribe("aggregateLocations", {});
	return {
		aggregateLocations: AggregateLocations.findFromPublication("aggregateLocations", {}).fetch(),
		aggregateLocationsReady: aggregateLocationsHandle.ready()
	};
})(Query);

export default Query