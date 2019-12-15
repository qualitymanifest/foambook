import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Meteor } from "meteor/meteor";
import AddNoteForm from "../imports/components/add_note_form";
import UserProfile from "../imports/components/user_profile";
import Query from "../imports/components/query";
import ReadMe from "../imports/components/read_me";
import Header from "../imports/components/header";

const routes = (
	<BrowserRouter>
        <div>
            <Header />
            <Switch>
                <Route path="/add_note" component={AddNoteForm} />
                <Route path="/user_profile" component={UserProfile} />
                <Route path="/read_me" component={ReadMe} />
                <Route path="/" component={Query} />
            </Switch>
        </div>
	</BrowserRouter>
);


Meteor.startup(() => {
	ReactDOM.render(routes, document.querySelector("#render-target"));
});
