// Declare our collection
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

// this is on client - can check with Meteor.isClient /isServer
Meteor.methods({
	'notes.insert' : (train) => {
		const { railroad, location, symbol, dateTime } = train
		const user = Meteor.userId();
		// do further validation ? should be pretty good if it made it here
		Notes.insert({ railroad, location, symbol, dateTime, user });
	}
})

export const Notes = new Mongo.Collection('notes');
