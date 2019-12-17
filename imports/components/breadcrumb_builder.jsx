import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Breadcrumb } from "react-bootstrap";

const breadcrumbBuilder = ({ qs, howComplete }) => {
  if (howComplete === "symbol") {
    return (
      <Breadcrumb>
        <LinkContainer to="">
          <Breadcrumb.Item>Search Home</Breadcrumb.Item>
        </LinkContainer>
        <LinkContainer to={`?city=${qs.city}&state=${qs.state}`}>
          <Breadcrumb.Item>{`${qs.city}, ${qs.state}`}</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item
          active
        >{`${qs.railroad}: ${qs.symbol}`}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }
  if (howComplete === "city") {
    return (
      <Breadcrumb>
        <LinkContainer to="">
          <Breadcrumb.Item>Search Home</Breadcrumb.Item>
        </LinkContainer>
        <Breadcrumb.Item active>{`${qs.city}, ${qs.state}`}</Breadcrumb.Item>
      </Breadcrumb>
    );
  }
  return null;
};

export default breadcrumbBuilder;
