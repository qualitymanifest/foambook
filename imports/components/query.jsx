import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Moment from "moment-timezone";

import { Metadata } from "../collections/notes";
import QueryDisplay from "./query_display";
import { metadataSorter, listLocations, listSymbols, parseQueryString, testRailroadAndSymbol, breadcrumbBuilder } from "../queryFunctions";

let completeQuery = {};

class Query extends Component {
	render() {
		if (!this.props.metadataReady) {
			return <div className="spinner" />;
		}
		let metadata = metadataSorter(this.props.metadata);
		let qString = queryString.parse(location.search)

		if (qString.city && qString.state && qString.railroad && qString.symbol) {
			// completeQuery is for sending into DB - not using raw query string in case errant values are present
			completeQuery = {city: qString.city, state: qString.state, railroad: qString.railroad, symbol: qString.symbol}
			let invalidDates = false;
			if (qString.begin && qString.end) {
				let begin = Moment(qString.begin, "MM-YYYY").toDate();
				// have to add .endOf("year"), otherwise you get beginning of stated month
				let end = Moment(qString.end, "MM-YYYY").endOf("year").toDate();
				let dateRegex = /^(0[1-9]|1[1-2])-\d{4}$/
				if (!dateRegex.test(qString.begin) || !dateRegex.test(qString.end) || begin > end) {
					invalidDates = true;
				}
				// throw dateTime in regardless so we know if we have to render date in breadcrumb
				completeQuery.dateTime = {"$gte": begin, "$lte": end}
			}
			let railroadAndSymbolTested = testRailroadAndSymbol(metadata, qString.city, qString.state, qString.railroad, qString.symbol);
				return (
				<div className="center">
					{ completeQuery.dateTime ? breadcrumbBuilder(qString, "dates") : breadcrumbBuilder(qString, "symbol") }
					{ 
						invalidDates ? "Sorry, invalid date range specified" :
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
	const metadataHandle = Meteor.subscribe("metadata", {});
	return {
		metadata: Metadata.findFromPublication("metadata", {}).fetch(),
		metadataReady: metadataHandle.ready()
	};
})(Query);

export default Query