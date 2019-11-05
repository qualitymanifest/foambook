import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Badge, PanelGroup, Panel, ButtonToolbar, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { Link } from "react-router-dom";

import { railroadSorter, symbolSorter, testAge } from "../utils/queryFunctions";
import FootNote from "./foot_note";
import { AggregateSymbols } from "../collections/aggregations";
import { QUERY_NOT_FOUND } from "../utils/constants";

class QuerySymbols extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sortType: "alpha"
		};
	}

	render() {
		const { city, state, aggregate, aggregateReady } = this.props;
		if (!aggregateReady) {
			return <div className="spinner" />;
		}
		if (!aggregate.length) {
			return <div style={{ clear: "both" }}>{QUERY_NOT_FOUND}</div>;
		}
		const railroads = railroadSorter(aggregate);
		const oneRailroad = (railroads.length === 1);
		return (
			<div className="fadeIn">
				<h3>
					{oneRailroad ? "Select symbol:" : "Select railroad & symbol:"}
				</h3>
				<PanelGroup
					accordion
					id="railroadsPanelGroup"
					className="boxMargin"
					defaultActiveKey={oneRailroad ? city + railroads[0].railroad : null}
				>
					{
						railroads.map((railroad) => {
							const columnStyle = railroad.symbols.length > 14 ? { columnCount: 3 } : {};
							return (
								<Panel id={railroad.railroad} key={railroad.railroad} eventKey={city + railroad.railroad}>
									<Panel.Heading>
										<Panel.Toggle>
											<Panel.Title>
												{railroad.railroad}
												<Badge className={testAge(railroad.mostRecent)}>
													{railroad.count}
												</Badge>
											</Panel.Title>
										</Panel.Toggle>
									</Panel.Heading>
									<Panel.Body collapsible className="queryList">
										<ButtonToolbar className="symbolSortOptions">
											<ToggleButtonGroup type="radio" name="sortType" defaultValue="alpha">
												<ToggleButton value="alpha" onClick={() => this.setState({ sortType: "alpha" })}>A-Z</ToggleButton>
												<ToggleButton value="recent" onClick={() => this.setState({ sortType: "recent" })}>Most Recent</ToggleButton>
												<ToggleButton value="count" onClick={() => this.setState({ sortType: "count" })}>Most Counted</ToggleButton>
											</ToggleButtonGroup>
										</ButtonToolbar>
										<div style={columnStyle}>
											{
												symbolSorter(railroad.symbols, this.state.sortType).map((symbol) => {
													return (
														<div className="queryItem" key={symbol.symbol}>
															<Link to={`?city=${city}&state=${state}&railroad=${railroad.railroad}&symbol=${symbol.symbol}`}>
																{symbol.symbol}
																<Badge className={testAge(symbol.mostRecent)}>
																	{symbol.count}
																</Badge>
															</Link>
														</div>
													);
												})
											}
										</div>
									</Panel.Body>
								</Panel>
							);
						})
					}
				</PanelGroup>
				<br />
				<FootNote />
			</div>
		);
	}
}

const MeteorQuerySymbols = withTracker(() => {
	const qs = queryString.parse(location.search);
	const selector = { _id: qs.city + qs.state };
	const handle = Meteor.subscribe("aggregateSymbols", selector);
	return {
		aggregate: AggregateSymbols.find(selector).fetch(),
		aggregateReady: handle.ready()
	};
})(QuerySymbols);

export default MeteorQuerySymbols;
