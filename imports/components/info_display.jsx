import React from "react";
import { Link } from "react-router-dom";

export default info = (props) => {
	if (!props.info[0]) {
		return null;
	}
	const { railroadFan, locations } = props.info[0];
	const { query } = props;
	const renderLocations = () => {
		return locations.map( location => {
			const { city, state } = location;
			// don't include current location
			if (city === query.city && state === query.state) {
				return;
			}
			return (
				<Link 
					className="infoItem"
					key={`${city}${state}`} 
					to={`?city=${city}&state=${state}&railroad=${query.railroad}&symbol=${query.symbol}`}>
					{city}, {state}
				</Link>
			);
		});
	}
	const renderRailroadFan = () => {
		return Object.keys(railroadFan).map( key => {
			const property = railroadFan[key];
			const properCaseKey = key[0].toUpperCase() + key.substring(1);
			if (property) {
				return (
					<span className="infoItem" key={key}>
						<strong>{properCaseKey}: </strong>
							{property}
					</span>
				);
			}
		});
	}
	return (
		<div className="box boxMargin boxPadding">
			{locations && 
				<>
					<h4>Other locations this train has been recorded at:</h4>
					{renderLocations()}
				</>
			}
			{railroadFan && 
				<>
					<h4>Info pulled from railroadfan.com:</h4>
					{renderRailroadFan()}
				</>
			}
		</div>
	)
}
