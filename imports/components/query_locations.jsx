import { Meteor } from "meteor/meteor";
import React from "react";
import { Badge, PanelGroup, Panel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";

import { AggregateLocations } from "../collections/aggregations";
import { locationSorter, testAge } from "../utils/queryFunctions";
import statesMap from "../utils/statesMap";


const QueryLocations = ({ locations, locationsReady }) => {
    if (!locationsReady) {
        return <div className="spinner" />;
    }
    const sortedLocations = locationSorter(locations);
    return (
        <>
            <h3>Select state & city:</h3>
            <PanelGroup accordion id="statesPanelGroup" className="boxMargin">
                {
                    sortedLocations.map((loc) => {
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
}

export default withTracker(() => {
    const locationsHandle = Meteor.subscribe("aggregateLocations", {});
    return {
        locations: AggregateLocations.findFromPublication("aggregateLocations", {}).fetch(),
        locationsReady: locationsHandle.ready()
    };
})(QueryLocations);
