import { Meteor } from "meteor/meteor";
import React from "react";
import { Badge, PanelGroup, Panel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

import FootNote from "./foot_note";
import AggregateNotes from "../collections/aggregations";
import { processLocations, getAgeClass } from "../utils/queryFunctions";
import statesMap from "../utils/statesMap";
import { AGGREGATE_LOCATIONS } from "../utils/constants";

const QueryLocations = ({ locations, locationsReady }) => {
  if (!locationsReady) {
    return <div className="spinner" />;
  }
  const processedLocations = processLocations(locations);
  return (
    <>
      <h3>Select state & city:</h3>
      <PanelGroup accordion id="statesPanelGroup" className="boxMargin">
        {processedLocations.map(([stateName, state]) => {
          const columnStyle = state.cities.length > 5 ? { columnCount: 2 } : {};
          return (
            <Panel id={stateName} key={stateName} eventKey={stateName}>
              <Panel.Heading>
                <Panel.Toggle>
                  <Panel.Title>
                    {statesMap[stateName]}
                    <Badge className={getAgeClass(state.mostRecent)}>
                      {state.count}
                    </Badge>
                  </Panel.Title>
                </Panel.Toggle>
              </Panel.Heading>
              <Panel.Body collapsible style={columnStyle} className="queryList">
                {Array.from(state.cities).map(([cityName, city]) => {
                  return (
                    <div className="queryItem" key={stateName + cityName}>
                      <Link to={`?city=${cityName}&state=${stateName}`}>
                        {cityName}
                        <Badge className={getAgeClass(city.mostRecent)}>
                          {city.count}
                        </Badge>
                      </Link>
                    </div>
                  );
                })}
              </Panel.Body>
            </Panel>
          );
        })}
      </PanelGroup>
      <br />
      <FootNote />
    </>
  );
};

export default withTracker(() => {
  const locationsHandle = Meteor.subscribe(AGGREGATE_LOCATIONS, {});
  return {
    locations: AggregateNotes.findFromPublication(
      AGGREGATE_LOCATIONS,
      {},
      {
        fields: { city: 1, state: 1, railroad: 1, count: 1, mostRecent: 1 },
        sort: { state: 1, city: 1 }
      }
    ).fetch(),
    locationsReady: locationsHandle.ready()
  };
})(QueryLocations);
