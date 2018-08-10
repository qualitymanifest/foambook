import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Notes, Metadata } from "../collections/notes";
import QueryDisplay from "./query_display";
import { metadataSorter, listLocations, listSymbols, parseQueryString } from "../queryFunctions";

let completeQuery = {};

class Query extends Component {
	render() {
		if (!this.props.metadataReady) {
			return <div className="spinner" />;
		}
		let metadata = metadataSorter(this.props.metadata);
		let qString = queryString.parse(location.search)

		if ("city" in qString && "state" in qString && "railroad" in qString && "symbol" in qString) {
			completeQuery = { city: qString.city, state: qString.state, railroad: qString.railroad, symbol: qString.symbol };
			console.log(this.props.notes)
				return (
				<div>
					<Breadcrumb>
						<LinkContainer to="">
					  	<Breadcrumb.Item>Search Home</Breadcrumb.Item>
					  </LinkContainer>
						<LinkContainer to={`?city=${qString.city}&state=${qString.state}`}>
					  	<Breadcrumb.Item>{`${qString.city}, ${qString.state}`}</Breadcrumb.Item>
					  </LinkContainer>
					  <LinkContainer to={`?city=${qString.city}&state=${qString.state}&railroad=${qString.railroad}&symbol=${qString.symbol}`}>
					  	<Breadcrumb.Item active>{`Railroad: ${qString.railroad}, Symbol: ${qString.symbol}`}</Breadcrumb.Item>
					  </LinkContainer>
					</Breadcrumb>
					{ /* Holding off on the below until redux is set up on this component */}
					{ /*<QueryDisplay notes={this.props.notes} loading={this.props.notesLoading} uiState={this.props.uiState} /> */}
				</div>
			)
		}

		if ("city" in qString && "state" in qString) {
			return (
				<div>
					<Breadcrumb>
						<LinkContainer to="">
					  	<Breadcrumb.Item>Search Home</Breadcrumb.Item>
					  </LinkContainer>
						<LinkContainer to={`?city=${qString.city}&state=${qString.state}`}>
					  	<Breadcrumb.Item active>{`${qString.city}, ${qString.state}`}</Breadcrumb.Item>
					  </LinkContainer>				
					</Breadcrumb>
					{ listSymbols(metadata, qString.city, qString.state) }
				</div>
			)
		}

		return (
			<div>
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
	const notesHandle = Meteor.subscribe("notes.query", completeQuery);
	return {
		metadata: Metadata.findFromPublication("metadata", {}).fetch(),
		metadataReady: metadataHandle.ready(),
		notes: Notes.findFromPublication("notes.query", completeQuery).fetch(),
		notesLoading: !notesHandle.ready()
	};
})(Query);

export default Query