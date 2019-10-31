import React from "react";
import { Badge, PanelGroup, Panel } from "react-bootstrap";
import { Link } from "react-router-dom";

import { testAge } from "../utils/queryFunctions";
import statesMap from "../utils/statesMap";


export default QueryLocations = ({ locations }) => (
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
