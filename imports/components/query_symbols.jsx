import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";

import { symbolSorter, listSymbols } from "../queryFunctions";
import { AggregateSymbols } from "../collections/aggregations";

class QuerySymbols extends Component {
	render() {
		if (!this.props.aggregateSymbolsReady) {
			return <div className="spinner" />
		}
		let sortedSymbols = symbolSorter(this.props.aggregateSymbols);
		return <React.Fragment>{ listSymbols(sortedSymbols, this.props.city, this.props.state) }</React.Fragment>

	}
}

QuerySymbols = withTracker(() => {
	const qs = queryString.parse(location.search);
	const selector = { _id: qs.city + qs.state };
	const aggregateHandle = Meteor.subscribe("aggregateSymbols", selector);
	return {
		aggregateSymbols: AggregateSymbols.find(selector).fetch(),
		aggregateSymbolsReady: aggregateHandle.ready()
	};
})(QuerySymbols);

export default QuerySymbols;
