import { Meteor } from "meteor/meteor";
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Breadcrumb } from "react-bootstrap";
import Moment from "moment-timezone";

import { AggregateLocations } from "../collections/aggregations";
import QueryDisplay from "./query_display";
import QuerySymbols from "./query_symbols";
import QueryLocations from "./query_locations";
import { locationSorter, testLocation, breadcrumbBuilder } from "../queryFunctions";

let completeQuery = {};

const Query = (props) => {
	const { aggregateLocationsReady, aggregateLocations } = props;
	if (!aggregateLocationsReady) {
		return <div className="spinner" />;
	}
	const sortedLocations = locationSorter(aggregateLocations);
	const qString = queryString.parse(location.search);
	const { city, state, railroad, symbol, year } = qString;

	if (city && state && railroad && symbol) {
		// completeQuery is for sending into DB - not using raw query string in case errant values are present
		completeQuery = { city, state, railroad, symbol };
		let invalidDate = false;
		if (year) {
			invalidDate = !/^\d{4}$/.test(year);
			let begin = Moment(year, "YYYY").startOf("year").toDate()
			let end = Moment(year, "YYYY").endOf("year").toDate();
			// throw dateTime in regardless so we know if we have to render date in breadcrumb
			completeQuery.dateTime = { "$gte": begin, "$lte": end }
		}
		const locationsTested = testLocation(sortedLocations, city, state);
		return (
			<div className="text-center">
				{completeQuery.dateTime ? breadcrumbBuilder(qString, "dates") : breadcrumbBuilder(qString, "symbol")}
				{
					invalidDate ? "Sorry, invalid year specified" :
						(typeof locationsTested === "string") ? locationsTested : <QueryDisplay query={completeQuery} />
				}
			</div>
		);
	}

	if (city && state) {
		const locationsTested = testLocation(sortedLocations, city, state);
		return (
			<div className="text-center">
				{breadcrumbBuilder(qString, "city")}
				{(typeof locationsTested === "string") ? locationsTested : <QuerySymbols city={city} state={state} />}
			</div>
		);
	}

	return (
		<div className="text-center fadeIn">
			<Breadcrumb>
				<Breadcrumb.Item active>Search Home</Breadcrumb.Item>
			</Breadcrumb>
			<QueryLocations locations={sortedLocations} />
		</div>
	);
};


export default withTracker(() => {
	const aggregateLocationsHandle = Meteor.subscribe("aggregateLocations", {});
	return {
		aggregateLocations: AggregateLocations.findFromPublication("aggregateLocations", {}).fetch(),
		aggregateLocationsReady: aggregateLocationsHandle.ready()
	};
})(Query);
