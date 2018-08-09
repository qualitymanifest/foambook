import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { Metadata } from "../collections/notes";
import QueryDisplay from "./query_display";

// meteor publishes randomly, even if DB is sorted:
const metadataSorter = (rawMetadata) => {
	let locations = rawMetadata.slice().sort((a, b) => {
		return (a.state > b.state) ? 1 : -1;
	})
	for (let state of locations) {
		state.cities.sort((a, b) => {
			return (a.city > b.city) ? 1 : -1;
		})
		for (let city of state.cities) {
			city.railroads.sort((a, b) => {
				return (a.railroad > b.railroad) ? 1 : -1;
			})
			for (let railroad of city.railroads) {
				railroad.symbols.sort((a, b) => {
					return (a.symbol > b.symbol) ? 1 : -1;
				})
			}
		}
	}
	return locations
}

class Query extends Component {
	render() {
		if (!this.props.metadataReady) {
			return <div className="spinner" />;
		}
		let sorted = metadataSorter(this.props.metadata);
		console.log(sorted);
		//console.log(queryString.parse(location.search));
		return (
			<div>
				<Link to="?first=test"> FIRST
				</Link>
				<Link to="?SECOND=thing"> SECOND
				</Link>
			</div>
		);
	}
}



Query = withTracker(() => {
	const metadataHandle = Meteor.subscribe("metadata", {});
	return {
		metadata: Metadata.findFromPublication("metadata", {}).fetch(),
		metadataReady: metadataHandle.ready(),
	};
})(Query);

export default Query