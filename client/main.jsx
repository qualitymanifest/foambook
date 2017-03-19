import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import AddNoteForm from './components/add_note_form';
import UserProfile from './components/user_profile';
import QueryForm from './components/query_form';

Accounts.onLogout(() => browserHistory.push('/'))

// IndexRoute is only visible if the parent / route doesn't have
// any visible children
const routes = (
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={QueryForm} />
			<Route path="add_note" component={AddNoteForm} />
			<Route path="user_profile" component={UserProfile} />
		</Route>
	</Router>
);

Meteor.startup(() => {
	ReactDOM.render(routes, document.querySelector('#render-target'));
})
