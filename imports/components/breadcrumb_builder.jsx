import React from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { Breadcrumb } from "react-bootstrap";

export default breadcrumbBuilder = ({ qs, howComplete }) => {
    if (howComplete === "dates") {
        return (
            <Breadcrumb>
                <LinkContainer to="">
                    <Breadcrumb.Item>Search Home</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`?city=${qs.city}&state=${qs.state}`}>
                    <Breadcrumb.Item>{`${qs.city}, ${qs.state}`}</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`?city=${qs.city}&state=${qs.state}&railroad=${qs.railroad}&symbol=${qs.symbol}`}>
                    <Breadcrumb.Item>{`${qs.railroad}: ${qs.symbol}`}</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>{`${qs.year}`}</Breadcrumb.Item>
            </Breadcrumb>
        );
    }
    if (howComplete === "symbol") {
        return (
            <Breadcrumb>
                <LinkContainer to="">
                    <Breadcrumb.Item>Search Home</Breadcrumb.Item>
                </LinkContainer>
                <LinkContainer to={`?city=${qs.city}&state=${qs.state}`}>
                    <Breadcrumb.Item>{`${qs.city}, ${qs.state}`}</Breadcrumb.Item>
                </LinkContainer>
                <Breadcrumb.Item active>{`${qs.railroad}: ${qs.symbol}`}</Breadcrumb.Item>
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
};