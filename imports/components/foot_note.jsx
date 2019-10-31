import React from "react";
import { Link } from "react-router-dom";

export default FootNote = () => (
    <>
        <small>
            <span>Badge number is the amount of notes, color indicates age of last submission: </span>
            <span className="pastMonth">past month</span>
            {" "}
            <span className="pastYear">past year</span>
            {" "}
            <span className="olderThanYear">older</span>
        </small>
        <br />
        <br />
        <p><strong><Link to="/read_me">What is this?</Link></strong></p>
    </>
);