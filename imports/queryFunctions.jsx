import React from "react";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Badge, PanelGroup, Panel, Breadcrumb } from "react-bootstrap";
import Moment from "moment-timezone";

import FootNote from "./components/foot_note";
import { statesMap } from "./validation";

Moment.tz.setDefault("Etc/UTC");
const monthAgo = Moment().subtract(1, "month");
const yearAgo = Moment().subtract(1, "year");

export const testAge = (mostRecent) => {
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

export const railroadSorter = (rawRailroads) => {
	return rawRailroads[0].railroads.sort((a, b) => {
		return (a.railroad > b.railroad) ? 1 : -1;
	});
};

export const symbolSorter = (symbols, sortType) => {
	if (sortType === "alpha") {
		return symbols.sort((a, b) => (a.symbol > b.symbol) ? 1 : -1);
	}
	if (sortType === "recent") {
		return symbols.sort((a, b) => (a.mostRecent < b.mostRecent) ? 1 : -1);
	}
	// there may be many with the same count, so sort those alphabetically too
	if (sortType === "count") {
		return symbols.sort((a, b) => (a.count === b.count && a.symbol > b.symbol) ? 1 : (a.count < b.count) ? 1 : -1);
	}
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
	notes.map((note) => {
		const newNote = Object.assign({}, note);
		const noteMoment = Moment(note.dateTime);
		newNote.time = (noteMoment.hours() * 60) + noteMoment.minutes();
		newNote.weekday = noteMoment.isoWeekday();
		newNotes.push(newNote);
		if (!years.includes(noteMoment.year())) {
			years.push(noteMoment.year());
		}
	});
	return { notes: newNotes, oldest, newest, years };
};

export const badQuery = (specific) => {
	return "Sorry, invalid " + specific + ". Either you've followed a bad link, or you're searching for a newly added " + specific +
		" (search options are updated hourly)";
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
		<>
			<h3>Select state & city:</h3>
			<PanelGroup accordion id="statesPanelGroup" className="boxMargin">
				{
					locations.map((loc) => {
						const columnStyle = loc.cities.length > 5 ? { columnCount: 2 } : {};
						return (
							<Panel id={loc._id} key={loc._id} eventKey={loc._id}>
								<Panel.Heading>
									<Panel.Toggle>
										<Panel.Title>
											{statesMap[loc._id]}
											<Badge className={testAge(loc.mostRecent)}>
												{loc.count}
											</Badge>
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
			<FootNote />
		</>
	);
};

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
