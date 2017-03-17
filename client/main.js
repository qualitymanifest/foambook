import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'; 
import { Accounts } from 'meteor/accounts-base' // trying out

import App from './components/app';
import AddNoteForm from './components/add_note_form';
import UserProfile from './components/user_profile';
import QueryForm from './components/query_form';
import reducers from './reducer'
import { login /*logout*/ } from './actions';

// if redux-thunk/similar is used, it will be 2nd arg here
// after passed into applyMiddleware
const store = createStore(reducers);

store.subscribe(() => console.log('redux subscribe in client main', store.getState()))
// IndexRoute is only visible if the parent / route doesn't have
// any visible children
const routes = (
	<Provider store = {store}>
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
	ReactDOM.render(routes, document.querySelector('#render-target'));
})
