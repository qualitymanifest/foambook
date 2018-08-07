import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Metadata } from "../collections/notes";
import QueryDisplay from "./query_display";

class Query extends Component {
	render() {
		if (!this.props.metadataReady) {
			return <div className="spinner" />;
		}
		//console.log(queryString.parse(location.search));
		console.log(this.props.metadata);
		return (
			<p> HI 
			</p>
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