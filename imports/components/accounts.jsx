import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Template } from "meteor/templating";
import { Blaze } from "meteor/blaze";

class Accounts extends Component {
  componentDidMount() {
    this.view = Blaze.render(
      Template.loginButtons,
      ReactDOM.findDOMNode(this.loginRender) // eslint-disable-line
    );
  }

  componentWillUnmount() {
    Blaze.remove(this.view);
  }

  render() {
    return (
      <div
        ref={div => {
          this.loginRender = div;
        }}
      />
    );
  }
}

export default Accounts;
