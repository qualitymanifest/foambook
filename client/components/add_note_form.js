import React, { Component } from 'react';
import { Form, Text, FormField, FormError } from 'react-form'
import _ from 'lodash'
import { createContainer } from 'meteor/react-meteor-data'
import dateutil from 'dateutil';

import { Notes } from '../../imports/collections/notes'
import { validation, cleanLocation } from '../validation.js';
import DateTime from './dateTime';
import RecentSubmissions from './recent_submissions';
/*
might want this for storing
let date = new Date()
let offset = date.getTimezoneOffset() / 60
let currHours = date.getUTCHours() // getHours might convert to local time? which i dont want
date.setUTCHours(currHours-offset)
*/

/*https://github.com/meteor-useraccounts/core/blob/master/Guide.md#quickstart
	http://docs.meteor.com/api/accounts-multi.html#AccountsCommon-onLogin */
class AddNoteForm extends Component {

	onSubmit(values, state, props) {
	/* had to clone using Object.assign because previously added
	values were changing to be the lowercased first letter of the
	new value????????? */
	valuesCopy = Object.assign({}, values)
	valuesCopy.location = cleanLocation(valuesCopy.location)
	valuesCopy.dateTime = dateutil.parse(valuesCopy.dateTime);
	// clear out symbol and date fields:

	// assuming user isn't constantly changing rr/loc, focus on symbol
	document.querySelector('#symbol').focus();
	event.preventDefault();
	Meteor.call('notes.insert', valuesCopy, (err) => {
		if (err) {
			console.log('error during train form submission', err)
		}
	})
	}

	render() {
		if (!this.props.user) { return <div>Please log in to submit train notes</div> }
		return (
			<div>
			<Form
			onSubmit={this.onSubmit.bind(this)}
			defaultValues ={{
				// for testing. before production, autofill RR/loc with user preferences
				// keep datetime autofill, but obviously not symbol.
				railroad : "UP", 
				location: "TUCSON, AZ", 
				symbol : "QEWWC",
				dateTime : dateutil.format( new Date() , 'm-d-y H:i' ) }}
			preValidate={values => {
				// auto-uppercase input. seems easier than dealing with multiple
				// controlled components
				return _.mapValues(values, value => value ? value.toUpperCase() : null)
			}}
			validate={values => validation(values)}
			>
				{({ values, submitForm, addValue, removeValue, setValue, getError }) => {
					return (
						<form onSubmit={submitForm}>
							<label>Railroad reporting marks</label>
							<Text field="railroad" placeholder="UP | ??" />
							<label>Location (must include 2 letter state)</label>
							<Text field="location" placeholder="Tucson, AZ" />
							<label>Symbol</label>
							<Text field="symbol" id="symbol" placeholder="SYMBOL" autoFocus/>
							<label>Date/Time</label>
							<DateTime field="dateTime" placeholder="MM-DD-YY HH:MM"/>
							<button>Submit</button>
						</form>
					)
				}}

			</Form>
			<RecentSubmissions recentSubmissions={this.props.notes} />
			</div>
		)
	}
}

AddNoteForm = createContainer(() => {
	Meteor.subscribe('notes');
	return { 
		notes : Notes.find({}).fetch(),
		user : Meteor.user() }
}, AddNoteForm);

export default AddNoteForm