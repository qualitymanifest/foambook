import React from "react";
import { Breadcrumb } from "react-bootstrap";

import QueryDisplay from "./query_display";
import QuerySymbols from "./query_symbols";
import QueryLocations from "./query_locations";
import BreadcrumbBuilder from "./breadcrumb_builder";
import { parseQueryString } from "../utils/queryFunctions";

let completeQuery = {};

const Query = () => {
  const qString = parseQueryString();
  const { city, state, railroad, symbol } = qString;

  if (city && state && railroad && symbol) {
    // completeQuery is for querying DB - not using raw query string in case errant values are present
    completeQuery = { city, state, railroad, symbol };
    return (
      <div className="text-center">
        <BreadcrumbBuilder qs={qString} howComplete="symbol" />
        <QueryDisplay query={completeQuery} />
      </div>
    );
  }

  if (city && state) {
    return (
      <div className="text-center">
        <BreadcrumbBuilder qs={qString} howComplete="city" />
        <QuerySymbols city={city} state={state} />
      </div>
    );
  }

  return (
    <div className="text-center fadeIn">
      <Breadcrumb>
        <Breadcrumb.Item active>Search Home</Breadcrumb.Item>
      </Breadcrumb>
      <QueryLocations />
    </div>
  );
};

export default Query;
