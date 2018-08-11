import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Meteor } from "meteor/meteor"
import { Accounts } from "meteor/accounts-base";

import reducers from "./reducers";
import { screenResize } from "./actions";
import AddNoteForm from "../imports/components/add_note_form";
import UserProfile from "../imports/components/user_profile";
import Query from "../imports/components/query";
import ReadMe from "../imports/components/read_me";
import Header from "../imports/components/header";


//Accounts.onLogout(() => browserHistory.push("/"));

const store = createStore(reducers);

window.addEventListener("resize", () => {
	store.dispatch(screenResize(window.innerWidth));
});


const routes = (
	<Provider store={store}>
		<BrowserRouter>
			<div>
				<Header />
				<Switch>
				<Route path="/query" component={Query} />
				<Route path="/add_note" component={AddNoteForm} />
				<Route path="/user_profile" component={UserProfile} />
				<Route path="/read_me" component={ReadMe} />
				<Route path="/" component={Query} />
				</Switch>
			</div>
		</BrowserRouter>
	</Provider>
);


Meteor.startup(() => {
	ReactDOM.render(routes, document.querySelector("#render-target"));
});
