import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Badge, Row, Col, PanelGroup, Panel } from "react-bootstrap";
import queryString from "query-string";
import Moment from "moment-timezone";

Moment.tz.setDefault("Etc/UTC");
const monthAgo = Moment().subtract(1, 'month');
const yearAgo = Moment().subtract(1, 'year');

const statesMap = {
  'AL' : 'ALABAMA',
  'AK' : 'ALASKA',
  'AZ' : 'ARIZONA',
  'AR' : 'ARKANSAS',
  'CA' : 'CALIFORNIA',
  'CO' : 'COLORADO',
  'CT' : 'CONNECTICUT',
  'DE' : 'DELAWARE',
  'DC' : 'WASHINGTON DC',
  'FL' : 'FLORIDA',
  'GA' : 'GEORGIA',
  'ID' : 'IDAHO',
  'IL' : 'ILLINOIS',
  'IN' : 'INDIANA',
  'IA' : 'IOWA',
  'KS' : 'KANSAS',
  'KY' : 'KENTUCKY',
  'LA' : 'LOUISIANA',
  'ME' : 'MAINE',
  'MD' : 'MARYLAND',
  'MA' : 'MASSACHUSETTS',
  'MI' : 'MICHIGAN',
  'MN' : 'MINNESOTA',
  'MS' : 'MISSISSIPPI',
  'MO' : 'MISSOURI',
  'MT' : 'MONTANA',
  'NE' : 'NEBRASKA',
  'NV' : 'NEVADA',
  'NH' : 'NEW HAMPSHIRE',
  'NJ' : 'NEW JERSEY',
  'NM' : 'NEW MEXICO',
  'NY' : 'NEW YORK',
  'NC' : 'NORTH CAROLINA',
  'ND' : 'NORTH DAKOTA',
  'OH' : 'OHIO',
  'OK' : 'OKLAHOMA',
  'OR' : 'OREGON',
  'PA' : 'PENNSYLVANIA',
  'RI' : 'RHODE ISLAND',
  'SC' : 'SOUTH CAROLINA',
  'SD' : 'SOUTH DAKOTA',
  'TN' : 'TENNESSEE',
  'TX' : 'TEXAS',
  'UT' : 'UTAH',
  'VT' : 'VERMONT',
  'VA' : 'VIRGINIA',
  'WA' : 'WASHINGTON',
  'WV' : 'WEST VIRGINIA',
  'WI' : 'WISCONSIN',
  'WY' : 'WYOMING',
  'AB' : 'ALBERTA',
  'BC' : 'BRITISH COLUMBIA',
  'MB' : 'MANITOBA',
  'NB' : 'NEW BRUNSWICK',
  'NL' : 'NEWFOUNDLAND/LABRADOR',
  'NS' : 'NOVA SCOTIA',
  'NT' : 'NORTHWEST TERRITORIES',
  'ON' : 'ONTARIO',
  'QC' : 'QUEBEC',
  'SK' : 'SASKATCHEWAN',
  'YT' : 'YUKON'
}

// meteor publishes randomly, even if DB is sorted:
export const metadataSorter = (rawMetadata) => {
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

export const processNotes = (notes) => {
	let oldest = Moment(notes[0].dateTime);
	let newest = Moment(notes[0].dateTime);
	let years = [];
	const newNotes = [];
	for (let note of notes) {
		let newNote = Object.assign({}, note);
		let noteMoment = Moment(note.dateTime);
		newNote.time = (noteMoment.hours() * 60) + noteMoment.minutes()
		newNote.dateTimeReadable = Moment(note.dateTime).format("MM-DD-YY HH:mm")
		newNote.weekday = noteMoment.isoWeekday();
		newNotes.push(newNote);
		if (noteMoment < oldest) {
			oldest = noteMoment
		}
		else if (noteMoment > newest) {
			newest = noteMoment;
		}
		if (!years.includes(noteMoment.year())) {
			years.push(noteMoment.year());
		}
	}
	return {notes: newNotes, oldest: oldest, newest: newest, years: years.sort()};
}

const badQuery = (specific) => {
	return "Sorry, invalid " + specific + ". Either you've followed a bad link, or you're searching for a newly created " + specific +
	" (query categories are updated hourly)";
}


export const testRailroadAndSymbol = (metadata, searchCity, searchState, searchRailroad, searchSymbol) => {
	let railroads = findRailroads(metadata, searchCity, searchState);
	if (typeof railroads === "string") { // It's an error message!
		return railroads;
	}
	for (let railroad of railroads) {
		if (railroad.railroad === searchRailroad) {
			for (let symbol of railroad.symbols) {
				if (symbol.symbol === searchSymbol) {
					return true;
				}
			}
			return badQuery("symbol");
		}
	}
	return badQuery("railroad");
}

const findRailroads = (metadata, searchCity, searchState) => {
	for (let state of metadata) {
		if (state.state === searchState) {
			for (let city of state.cities) {
				if (city.city === searchCity) {
					return city.railroads;
				}
			}
			return badQuery("city");
		}
	}
	return badQuery("state");
}

export const listLocations = (locations) => {
	return (
		<div>
			<p>Select state & city</p>
			<PanelGroup accordion id="statesPanelGroup">
			{ 
				locations.map((loc) => {
					return (
						<Panel id={loc.state} key={loc.state} eventKey={loc.state}>
							<Panel.Heading>
								<Panel.Title toggle>
									{statesMap[loc.state]}
								</Panel.Title>
							</Panel.Heading>
							<Panel.Body collapsible className="queryList">
								{
									loc.cities.map((city) => {
										return (
											<div className="queryItem" key={city.city}>
												<Link to={`?city=${city.city}&state=${loc.state}`}>
													{city.city}
													<Badge className={city.mostRecent > monthAgo ? "pastMonth" : city.mostRecent > yearAgo ? "pastYear" : "olderThanYear"}>
														{city.count}
													</Badge>
												</Link>
											</div>
										)
									})
								}
							</Panel.Body>
						</Panel>
					)
				})
			}
			</PanelGroup>
			<br />
			<p className="smallPrint">Numbers to the right of the city are the amount of notes</p>
			<p className="smallPrint">
				<span>Color indicates age of last submission: </span>
				<span className="pastMonth">past month, </span>
				<span className="pastYear">past year, </span>
				<span className="olderThanYear">older </span>
			</p>
		</div>
	)
}


export const listSymbols = (metadata, city, state) => {
		let railroads = findRailroads(metadata, city, state);
		if (typeof railroads === "string") { // then it's an error
			return railroads;
		}
		return (
		<div>
			<p>Select railroad & symbol</p>
			<PanelGroup accordion id="railroadsPanelGroup">
				{ 
					railroads.map((railroad) => {
						let columnStyle = railroad.symbols.length > 30 ? {columnCount: 3} : {};
						return (
							<Panel id={railroad.railroad} key={railroad.railroad} eventKey={city + railroad.railroad}>
								<Panel.Heading>
									<Panel.Title toggle>
										{railroad.railroad}
									</Panel.Title>
								</Panel.Heading>
								<Panel.Body collapsible style={columnStyle} className="queryList">
									{
										railroad.symbols.map((symbol) => {
											return (
												<div className="queryItem" key={symbol.symbol}>
													<Link to={`?city=${city}&state=${state}&railroad=${railroad.railroad}&symbol=${symbol.symbol}`}>
														{symbol.symbol}
														<Badge className={symbol.mostRecent > monthAgo ? "pastMonth" : symbol.mostRecent > yearAgo ? "pastYear" : "olderThanYear"}>
															{symbol.count}
														</Badge>
													</Link>
												</div>
											)
										})
									}
								</Panel.Body>
							</Panel>
						)
					})
				}
			</PanelGroup>
			<br />
			<p className="smallPrint">Numbers to the right of the symbol are the amount of notes</p>
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
		)
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
		)
	}
	if (howComplete === "city") {
		return (
			<Breadcrumb>
				<LinkContainer to="">
			  	<Breadcrumb.Item>Search Home</Breadcrumb.Item>
			  </LinkContainer>
			  <Breadcrumb.Item active>{`${qs.city}, ${qs.state}`}</Breadcrumb.Item>	
			</Breadcrumb>
		)
	}
}