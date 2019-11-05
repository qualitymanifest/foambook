import React from "react";
import queryString from "query-string";
import { Breadcrumb } from "react-bootstrap";
import Moment from "moment-timezone";

import QueryDisplay from "./query_display";
import QuerySymbols from "./query_symbols";
import QueryLocations from "./query_locations";
import BreadcrumbBuilder from "./breadcrumb_builder";

let completeQuery = {};

export default Query = () => {
	const qString = queryString.parse(location.search);
	const { city, state, railroad, symbol, year } = qString;

	if (city && state && railroad && symbol) {
		// completeQuery is for querying DB - not using raw query string in case errant values are present
		completeQuery = { city, state, railroad, symbol };
		let invalidDate = false;
		if (year) {
			invalidDate = !/^\d{4}$/.test(year);
			let begin = Moment(year, "YYYY").startOf("year").toDate()
			let end = Moment(year, "YYYY").endOf("year").toDate();
			// throw dateTime in regardless so we know if we have to render date in breadcrumb
			completeQuery.dateTime = { "$gte": begin, "$lte": end }
		}
		return (
			<div className="text-center">
				{completeQuery.dateTime ?
					<BreadcrumbBuilder qs={qString} howComplete="dates" /> :
					<BreadcrumbBuilder qs={qString} howComplete="symbol" />
				}
				{
					invalidDate ? "Sorry, invalid year specified" :
						<QueryDisplay query={completeQuery} />
				}
			</div>
		);
	}

	if (city && state) {
		return (
			<div className="text-center">
				<BreadcrumbBuilder qs={qString} howComplete="city" />
				<QuerySymbols city={city} state={state} />
			</div>
		);
	}

	return (
		<div className="text-center fadeIn">
			<Breadcrumb>
				<Breadcrumb.Item active>Search Home</Breadcrumb.Item>
			</Breadcrumb>
			<QueryLocations />
		</div>
	);
};
