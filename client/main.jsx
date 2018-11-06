import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { ConnectedRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import { Meteor } from "meteor/meteor";

import createRootReducer from "./reducers";
import { screenResize } from "./actions";
import AddNoteForm from "../imports/components/add_note_form";
import UserProfile from "../imports/components/user_profile";
import Query from "../imports/components/query";
import ReadMe from "../imports/components/read_me";
import Header from "../imports/components/header";


const history = createBrowserHistory();

const store = createStore(
	createRootReducer(history),
	applyMiddleware(
		routerMiddleware(history)
	)
);

window.addEventListener("resize", () => {
	// using documentElement.clientWidth because window.innerWidth was inaccurate when resizing mobile
	store.dispatch(screenResize(document.documentElement.clientWidth));
});


const routes = (
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<div>
				<Header />
				<Switch>
					<Route path="/add_note" component={AddNoteForm} />
					<Route path="/user_profile" component={UserProfile} />
					<Route path="/read_me" component={ReadMe} />
					<Route path="/" component={Query} />
				</Switch>
			</div>
		</ConnectedRouter>
	</Provider>
);


Meteor.startup(() => {
	ReactDOM.render(routes, document.querySelector("#render-target"));
});
