import React from "react";
import { Link } from "react-router-dom";
import { Badge, Row, Col } from "react-bootstrap";
import queryString from "query-string";

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

const badQuery = (specific) => {
	return "Sorry, invalid " + specific + ". Either you've followed a bad link, or you're searching for a newly created " + specific +
	" (query categories are updated hourly)";
}

export const listLocations = (locations) => {
	// locations is the entire metadata array
	return (
		<div>
			{ 
				locations.map((loc) => {
					return (
						<div key={loc.state}>
							<h1>{loc.state}</h1>
							{
								loc.cities.map((city) => {
									return <div key={city.city}><Link to={`?city=${city.city}&state=${loc.state}`}>{city.city}</Link></div>
								})
							}
						</div>
					)
				})
			}
		</div>
	)
}


export const testRailroadAndSymbol = (metadata, searchCity, searchState, searchRailroad, searchSymbol) => {
	let railroads = findRailroads(metadata, searchCity, searchState);
	for (let railroad of railroads) {
		if (railroad.railroad === searchRailroad) {
			for (let symbol of railroad.symbols) {
				if (symbol.symbol === searchSymbol) {
					return true;
				}
			}
			return badQuery("symbol");
		}
		return badQuery("railroad");
	}
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


export const listSymbols = (metadata, city, state) => {
		let railroads = findRailroads(metadata, city, state);
		if (typeof railroads === "string") {
			return railroads;
		}
		return (
		<div>
			{ 
				railroads.map((railroad) => {
					let columnStyle = railroad.symbols.length > 30 ? {columnCount: 3} : {};
					return (
						<div key={railroad.railroad}>
							<h1>{railroad.railroad}</h1>
							<div style={columnStyle} className="queryList">
								{
									railroad.symbols.map((symbol) => {
										return (
											<div key={symbol.symbol}>
												<Link to={`?city=${city}&state=${state}&railroad=${railroad.railroad}&symbol=${symbol.symbol}`}>
													{symbol.symbol}
												</Link>
												<Badge>
													{symbol.count}
												</Badge>
											</div>
										)
									})
								}
							</div>
						</div>
					)
				})
			}
		</div>
	)
}