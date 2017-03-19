import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { browserHistory } from 'react-router';
import { Form, Text, FormField, FormError } from 'react-form'

import { Notes } from '../../imports/collections/notes';
import NotesTable from './notes_table';


class UserProfile extends Component {

	componentWillMount() {
		if (!this.props.user) {
			browserHistory.push('/')
		}
	}
	render() {
		return (
			<div>
				If you are going to be submitting notes for the same location and/or railroad,
				specify those here. That way, when you go to submit a note, those fields will
				be automatically filled for you!
				<NotesTable notes={this.props.notes} />
			</div>
		)
	}
}


UserProfile = createContainer(() => {
	Meteor.subscribe('user.notes');
	return { 
		notes : Notes.find({}).fetch(),
		user : Meteor.user() }
}, UserProfile);

export default UserProfile