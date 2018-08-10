import React from "react";
import { Link } from "react-router-dom";
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

export const listLocations = (locations) => {
	// locations is the entire metadata array
	return (
		<div>
			{ 
				locations.map((location) => {
					return (
						<div>
							<h1>{location.state}</h1>
							{
								location.cities.map((city) => {
									return <div><Link to={`?city=${city.city}&state=${location.state}`}>{city.city}</Link></div>
								})
							}
						</div>
					)
				})
			}
		</div>
	)
}

const findRailroads = (metadata, searchCity, searchState) => {
	for (let state of metadata) {
		if (state.state === searchState) {
			for (let city of state.cities) {
				if (city.city === searchCity) {
					return city.railroads;
				}
			}
		}
	}
}

export const listSymbols = (metadata, city, state) => {
		let railroads = findRailroads(metadata, city, state);
		return (
		<div>
			{ 
				railroads.map((railroad) => {
					return (
						<div>
							<h1>{railroad.railroad}</h1>
							{
								railroad.symbols.map((symbol) => {
									return (
										<div>
											<Link to={`?city=${city}&state=${state}&railroad=${railroad.railroad}&symbol=${symbol.symbol}`}>{symbol.symbol}</Link>
											({symbol.count})
										</div>
									)
								})
							}
						</div>
					)
				})
			}
		</div>
	)
}