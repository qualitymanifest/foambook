import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import Moment from "moment"

// this is on client - can check with Meteor.isClient /isServer
Meteor.methods({
	"notes.insert": (train) => {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		const note = Object.assign(
			{},
			train, 
			{ userId: Meteor.userId(), createdAt: Moment().format("x") }
		);
		Notes.insert(note);
	}
});

const Notes = new Mongo.Collection("notes");
Notes.schema = new SimpleSchema({
	railroad: { type: String, max: 10 },
	location: { type: [String], minCount: 2, maxCount: 3 },
	symbol: { type: String, max: 10 },
	dateTime: { type: Date },
	userId: { type: String },
	createdAt: { type: Number }
});
Notes.attachSchema(Notes.schema);

exports.Notes = Notes;
