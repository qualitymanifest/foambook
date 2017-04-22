import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { Meteor } from 'meteor/meteor'
import { Accounts } from "meteor/accounts-base";

import reducers from "./reducers";
import { screenResize } from "./actions";
import AddNoteForm from "../imports/components/add_note_form";
import UserProfile from "../imports/components/user_profile";
import QueryForm from "../imports/components/query_form";
import Header from "../imports/components/header";

Accounts.onLogout(() => browserHistory.push("/"));

// IndexRoute is only visible if the parent / route doesn't have
// any visible children
const App = props => (
	<div>
		<Header />
		{props.children}
	</div>
);

const store = createStore(reducers);

window.addEventListener("resize", () => {
	store.dispatch(screenResize(window.innerWidth));
});

store.subscribe(() => console.log(store.getState()));

const routes = (
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={QueryForm} />
				<Route path="add_note" component={AddNoteForm} />
				<Route path="user_profile" component={UserProfile} />
			</Route>
		</Router>
	</Provider>
);

Meteor.startup(() => {
	ReactDOM.render(routes, document.querySelector("#render-target"));
});
