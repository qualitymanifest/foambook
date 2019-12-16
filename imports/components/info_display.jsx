import React from "react";
import { Link } from "react-router-dom";

const renderLocations = (locations, query) => {
  return locations.map(location => {
    const { city, state } = location;
    // don't include current location
    if (city === query.city && state === query.state) {
      return null;
    }
    return (
      <Link
        className="infoItem"
        key={`${city}${state}`}
        to={`?city=${city}&state=${state}&railroad=${query.railroad}&symbol=${query.symbol}`}
      >
        {city}, {state}
      </Link>
    );
  });
};

const renderRailroadFan = railroadFan => {
  return Object.entries(railroadFan).map(([key, property]) => {
    const properCaseKey = key[0].toUpperCase() + key.substring(1);
    return property ? (
      <span className="infoItem" key={key}>
        <strong>{properCaseKey}: </strong>
        {property}
      </span>
    ) : null;
  });
};

const InfoDisplay = ({ info, query }) => {
  if (!info.length) return null;

  const { railroadFan, locations } = info[0];
  return (
    <div className="box boxMargin boxPadding fadeIn">
      {locations && (
        <>
          <h4>Other locations this train has been recorded at:</h4>
          {renderLocations(locations, query)}
        </>
      )}
      {railroadFan && (
        <>
          <h4>Info pulled from railroadfan.com:</h4>
          {renderRailroadFan(railroadFan)}
        </>
      )}
    </div>
  );
};

export default InfoDisplay;
