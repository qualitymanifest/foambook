import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// this is on client - can check with Meteor.isClient /isServer
Meteor.methods({
	'notes.insert': (train) => {
		const { railroad, location, symbol, dateTime } = train;
		const user = Meteor.userId();
		// do further validation ? should be pretty good if it made it here
		Notes.insert({ railroad, location, symbol, dateTime, user });
	},
	'user.update': (preferences) => {
		Meteor.users.update({ _id: Meteor.userId() },
			{ $set: { 'profile.name': 'yogi' } });
	},
});

export const Notes = new Mongo.Collection('notes');
