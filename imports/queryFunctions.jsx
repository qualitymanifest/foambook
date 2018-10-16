import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Badge, PanelGroup, Panel, Breadcrumb } from "react-bootstrap";
import Moment from "moment-timezone";

import { statesMap } from "./validation";

Moment.tz.setDefault("Etc/UTC");
const monthAgo = Moment().subtract(1, "month");
const yearAgo = Moment().subtract(1, "year");

const testAge = (mostRecent) => {
	if (mostRecent > monthAgo) {
		return "pastMonth";
	}
	if (mostRecent > yearAgo) {
		return "pastYear";
	}
	return "olderThanYear";
};

// meteor publishes randomly, even if DB is sorted:
export const locationSorter = (rawLocations) => {
	const locations = rawLocations.sort((a, b) => {
		return (a._id > b._id) ? 1 : -1;
	});
	locations.forEach((state) => {
		state.cities.sort((a, b) => (a.city > b.city) ? 1 : -1);
	});
	return locations;
};

export const symbolSorter = (rawSymbols) => {
	const railroads = rawSymbols[0].railroads.sort((a, b) => {
		return (a.railroad > b.railroad) ? 1 : -1;
	});
	railroads.forEach((railroad) => {
		railroad.symbols.sort((a, b) => (a.symbol > b.symbol) ? 1 : -1);
	});
	return railroads;
};

export const commentsSorter = (comments, city, state) => {
	const localComments = [];
	const otherComments = [];
	comments.map((comment) => {
		if (comment.city === city && comment.state === state) {
			localComments.push(comment);
		}
		else {
			otherComments.push(comment);
		}
	});
	return { local: localComments, other: otherComments };
};

export const processNotes = (notes) => {
	const oldest = Moment(notes[0].dateTime);
	const newest = Moment(notes[notes.length - 1].dateTime);
	const years = [];
	const newNotes = [];
	for (let note of notes) {
		const newNote = Object.assign({}, note);
		const noteMoment = Moment(note.dateTime);
		newNote.time = (noteMoment.hours() * 60) + noteMoment.minutes();
		newNote.dateTimeReadable = Moment(note.dateTime).format("MM-DD-YY HH:mm");
		newNote.weekday = noteMoment.isoWeekday();
		newNotes.push(newNote);
		if (!years.includes(noteMoment.year())) {
			years.push(noteMoment.year());
		}
	}
	return { notes: newNotes, oldest, newest, years };
};

export const badQuery = (specific) => {
	return "Sorry, invalid " + specific + ". Either you've followed a bad link, or you're searching for a newly created " + specific +
	" (query categories are updated every 15 minutes)";
};


export const testLocation = (metadata, searchCity, searchState) => {
	for (let state of metadata) {
		if (state._id === searchState) {
			for (let city of state.cities) {
				if (city.city === searchCity) {
					return true
				}
			}
			return badQuery("city");
		}
	}
	return badQuery("state");
};

export const listLocations = (locations) => {
	return (
		<React.Fragment>
			<p>Select state & city</p>
			<PanelGroup accordion id="statesPanelGroup">
				{
					locations.map((loc) => {
						const columnStyle = loc.cities.length > 5 ? { columnCount: 2 } : {};
						return (
							<Panel id={loc._id} key={loc._id} eventKey={loc._id}>
								<Panel.Heading>
									<Panel.Toggle>
										<Panel.Title>
											{statesMap[loc._id]}
										</Panel.Title>
									</Panel.Toggle>
								</Panel.Heading>
								<Panel.Body collapsible style={columnStyle} className="queryList">
									{
										loc.cities.map((city) => {
											return (
												<div className="queryItem" key={city.city}>
													<Link to={`?city=${city.city}&state=${loc._id}`}>
														{city.city}
														<Badge className={testAge(city.mostRecent)}>
															{city.count}
														</Badge>
													</Link>
												</div>
											);
										})
									}
								</Panel.Body>
							</Panel>
						);
					})
				}
			</PanelGroup>
			<br />
			<p className="smallPrint">Numbers to the right of cities are the amount of notes</p>
			<p className="smallPrint">
				<span>Color indicates age of last submission: </span>
				<span className="pastMonth">past month, </span>
				<span className="pastYear">past year, </span>
				<span className="olderThanYear">older </span>
			</p>
		</React.Fragment>
	)
}


export const listSymbols = (railroads, city, state) => {
	const oneRailroad = (railroads.length === 1);
	return (
		<div className="fadeIn">
			<p>
				{oneRailroad ? "Select symbol" : "Select railroad & symbol"}
			</p>
			<PanelGroup
				accordion
				id="railroadsPanelGroup"
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
										</Panel.Title>
									</Panel.Toggle>
								</Panel.Heading>
								<Panel.Body collapsible style={columnStyle} className="queryList">
									{
										railroad.symbols.map((symbol) => {
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
								</Panel.Body>
							</Panel>
						);
					})
				}
			</PanelGroup>
			<br />
			<p className="smallPrint">Numbers to the right of symbols are the amount of notes</p>
			<p className="smallPrint">
				<span>Color indicates age of last submission: </span>
				<span className="pastMonth">past month, </span>
				<span className="pastYear">past year, </span>
				<span className="olderThanYear">older </span>
			</p>
		</div>
	)
}

export const breadcrumbBuilder = (qs, howComplete) => {
	if (howComplete === "dates") {
		return (
			<Breadcrumb>
				<LinkContainer to="">
					<Breadcrumb.Item>Search Home</Breadcrumb.Item>
				</LinkContainer>
				<LinkContainer to={`?city=${qs.city}&state=${qs.state}`}>
					<Breadcrumb.Item>{`${qs.city}, ${qs.state}`}</Breadcrumb.Item>
				</LinkContainer>
				<LinkContainer to={`?city=${qs.city}&state=${qs.state}&railroad=${qs.railroad}&symbol=${qs.symbol}`}>
					<Breadcrumb.Item>{`${qs.railroad}: ${qs.symbol}`}</Breadcrumb.Item>
				</LinkContainer>
				<Breadcrumb.Item active>{`${qs.year}`}</Breadcrumb.Item>
			</Breadcrumb>
		);
	}
	if (howComplete === "symbol") {
		return (
			<Breadcrumb>
				<LinkContainer to="">
					<Breadcrumb.Item>Search Home</Breadcrumb.Item>
				</LinkContainer>
				<LinkContainer to={`?city=${qs.city}&state=${qs.state}`}>
					<Breadcrumb.Item>{`${qs.city}, ${qs.state}`}</Breadcrumb.Item>
				</LinkContainer>
				<Breadcrumb.Item active>{`${qs.railroad}: ${qs.symbol}`}</Breadcrumb.Item>
			</Breadcrumb>
		);
	}
	if (howComplete === "city") {
		return (
			<Breadcrumb>
				<LinkContainer to="">
					<Breadcrumb.Item>Search Home</Breadcrumb.Item>
				</LinkContainer>
				<Breadcrumb.Item active>{`${qs.city}, ${qs.state}`}</Breadcrumb.Item>
			</Breadcrumb>
		);
	}
};
