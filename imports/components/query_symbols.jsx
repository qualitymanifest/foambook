import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { withTracker } from "meteor/react-meteor-data";
import {
  Badge,
  PanelGroup,
  Panel,
  ButtonToolbar,
  ToggleButtonGroup,
  ToggleButton
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { railroadSorter, symbolSorter, testAge } from "../utils/queryFunctions";
import FootNote from "./foot_note";
import { AggregateSymbols } from "../collections/aggregations";
import { QUERY_NOT_FOUND, SORT_TYPES } from "../utils/constants";

const QuerySymbols = ({ city, state, aggregate, aggregateReady }) => {
  if (!aggregateReady) {
    return <div className="spinner" />;
  }
  if (!aggregate.length) {
    return <div style={{ clear: "both" }}>{QUERY_NOT_FOUND}</div>;
  }
  const [sortType, setSortType] = useState(SORT_TYPES.ALPHA);
  const railroads = railroadSorter(aggregate);
  const oneRailroad = railroads.length === 1;
  return (
    <div className="fadeIn">
      <h3>{oneRailroad ? "Select symbol:" : "Select railroad & symbol:"}</h3>
      <PanelGroup
        accordion
        id="railroadsPanelGroup"
        className="boxMargin"
        defaultActiveKey={oneRailroad ? city + railroads[0].railroad : null}
      >
        {railroads.map(railroad => {
          const columnStyle =
            railroad.symbols.length > 14 ? { columnCount: 3 } : {};
          return (
            <Panel
              id={railroad.railroad}
              key={railroad.railroad}
              eventKey={city + railroad.railroad}
            >
              <Panel.Heading>
                <Panel.Toggle>
                  <Panel.Title>
                    {railroad.railroad}
                    <Badge className={testAge(railroad.mostRecent)}>
                      {railroad.count}
                    </Badge>
                  </Panel.Title>
                </Panel.Toggle>
              </Panel.Heading>
              <Panel.Body collapsible className="queryList">
                <ButtonToolbar className="buttonToolbar">
                  <ToggleButtonGroup
                    type="radio"
                    name="sortType"
                    defaultValue="alpha"
                  >
                    <ToggleButton
                      value="alpha"
                      onClick={() => setSortType(SORT_TYPES.ALPHA)}
                    >
                      A-Z
                    </ToggleButton>
                    <ToggleButton
                      value="recent"
                      onClick={() => setSortType(SORT_TYPES.RECENT)}
                    >
                      Most Recent
                    </ToggleButton>
                    <ToggleButton
                      value="count"
                      onClick={() => setSortType(SORT_TYPES.COUNT)}
                    >
                      Most Counted
                    </ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>
                <div style={columnStyle}>
                  {symbolSorter(railroad.symbols, sortType).map(symbol => {
                    return (
                      <div className="queryItem" key={symbol.symbol}>
                        <Link
                          to={`?city=${city}&state=${state}&railroad=${railroad.railroad}&symbol=${symbol.symbol}`}
                        >
                          {symbol.symbol}
                          <Badge className={testAge(symbol.mostRecent)}>
                            {symbol.count}
                          </Badge>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </Panel.Body>
            </Panel>
          );
        })}
      </PanelGroup>
      <br />
      <FootNote />
    </div>
  );
};

export default withTracker(({ city, state }) => {
  const selector = { _id: city + state };
  const handle = Meteor.subscribe("aggregateSymbols", selector);
  return {
    aggregate: AggregateSymbols.find(selector).fetch(),
    aggregateReady: handle.ready()
  };
})(QuerySymbols);
