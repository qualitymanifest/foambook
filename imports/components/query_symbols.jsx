import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import queryString from "query-string";
import { Badge, PanelGroup, Panel, ButtonToolbar, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { Link } from "react-router-dom";

import { railroadSorter, symbolSorter, testAge, FootNote } from "../queryFunctions";
import { AggregateSymbols } from "../collections/aggregations";

class QuerySymbols extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sortType: "alpha"
		};
	}

	render() {
		const { city, state, aggregateSymbols, aggregateSymbolsReady  } = this.props;
		if (!aggregateSymbolsReady) {
			return <div className="spinner" />;
		}
		const railroads = railroadSorter(aggregateSymbols);
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
												<ToggleButton value="alpha" onClick={() => this.setState({sortType: "alpha"})}>A-Z</ToggleButton>
												<ToggleButton value="recent" onClick={() => this.setState({sortType: "recent"})}>Most Recent</ToggleButton>
												<ToggleButton value="count" onClick={() => this.setState({sortType: "count"})}>Most Counted</ToggleButton>
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
	const aggregateHandle = Meteor.subscribe("aggregateSymbols", selector);
	return {
		aggregateSymbols: AggregateSymbols.find(selector).fetch(),
		aggregateSymbolsReady: aggregateHandle.ready()
	};
})(QuerySymbols);

export default MeteorQuerySymbols;
