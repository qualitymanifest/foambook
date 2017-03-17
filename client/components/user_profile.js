import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

const mapStateToProps = (state) => {
		return {
			user: state.user
		}
	}

class UserProfile extends Component {
	render(props) {
		return (
			<div>UserProfile {this.props.user.name}</div>
		)
	}
}


UserProfile = createContainer(() => {
	Meteor.subscribe('user.notes');
	return { 
		userNotes : userNotes.find({}).fetch(),
		user : Meteor.user() }
}, UserProfile);

export default UserProfile