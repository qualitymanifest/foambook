import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import Moment from "moment";
import SimpleSchema from "simpl-schema";

const Notes = new Mongo.Collection("notes");
Notes.schema = new SimpleSchema({
	railroad: { type: String, max: 10 },
	location: { type: Array, minCount: 2, maxCount: 3 },
	"location.$": { type: String, max: 20 },
	symbol: { type: String, max: 10 },
	dateTime: { type: Date },
	userId: { type: String },
	createdAt: { type: Number }
});
Notes.attachSchema(Notes.schema);

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
	},
	"notes.delete": (noteId) => {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Notes.remove({userId: Meteor.userId(), _id: noteId})
	},
	"user.update": (preferences) => {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		Meteor.users.update(Meteor.userId(), {
			$set: {
				preferences
			}
		});
	}
});

exports.Notes = Notes;
