import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Moment from "moment-timezone";

import { ClientAggregate } from "../collections/notes";
import QueryDisplay from "./query_display";
import { metadataSorter, listLocations, listSymbols, parseQueryString, testRailroadAndSymbol, breadcrumbBuilder } from "../queryFunctions";

let completeQuery = {};

class Query extends Component {
	render() {
		if (!this.props.aggregateReady || !this.props.aggregate.length) {
			return <div className="spinner" />;
		}
		let metadata = metadataSorter(this.props.aggregate);
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
			let railroadAndSymbolTested = testRailroadAndSymbol(metadata, qString.city, qString.state, qString.railroad, qString.symbol);
				return (
				<div className="center">
					{ completeQuery.dateTime ? breadcrumbBuilder(qString, "dates") : breadcrumbBuilder(qString, "symbol") }
					{ 
						invalidDate ? "Sorry, invalid date specified" :
						(typeof railroadAndSymbolTested === "string") ? railroadAndSymbolTested : <QueryDisplay query={completeQuery} /> 
					}
				</div>
			)
		}

		if (qString.city && qString.state) {
			return (
				<div className="center">
					{ breadcrumbBuilder(qString, "city") }
					{ listSymbols(metadata, qString.city, qString.state) }
				</div>
			)
		}

		return (
			<div className="center">
				<Breadcrumb>
					<Breadcrumb.Item active>Search Home</Breadcrumb.Item>
				</Breadcrumb>
				{ listLocations(metadata) }
			</div>
		)		

	}
}



Query = withTracker(() => {
	const aggregateHandle = Meteor.subscribe("aggregate");
	return {
		aggregate: ClientAggregate.find().fetch(),
		aggregateReady: aggregateHandle.ready()
	};
})(Query);

export default Query