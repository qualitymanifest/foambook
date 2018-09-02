import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import Moment from "moment";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";

// https://guide.meteor.com/collections.html#schemas-on-write

export const Notes = new Mongo.Collection("notes");

const NotesSchema = new SimpleSchema({
	railroad: { type: String, max: 10 },
	city: { type: String, max: 30 },
	state: { type: String, max: 2 },
	symbol: { type: String, max: 10 },
	dateTime: { type: Date }
});
export const NotesInsert = new ValidatedMethod({
	name: "notes.insert",
	validate: NotesSchema.validator(),
	run(train) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		const note = Object.assign(
			{},
			train,
			{ userId: Meteor.userId(), createdAt: Number(Moment().format("x")) }
		);
		Notes.insert(note);
		Meteor.users.update(Meteor.userId(), { $inc: { "notesCount": 1} });
	}

});

const DeleteSchema = new SimpleSchema({
	noteId: { type: String, regEx: /^[A-Za-z0-9]{17}$/ }
});
export const NotesDelete = new ValidatedMethod({
	name: "notes.delete",
	validate: DeleteSchema.validator(),
	run({ noteId }) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Notes.remove({ userId: Meteor.userId(), _id: noteId });
		Meteor.users.update(Meteor.userId(), { $inc: { "notesCount": -1} });
	}
});

const PreferenceSchema = new SimpleSchema({
	railroad: { type: String, max: 10, optional: true },
	city: { type: String, max: 30, optional: true },
	state: { type: String, max: 2, optional: true },
	timezone: { type: String, max: 20 }
});
export const UserUpdate = new ValidatedMethod({
	name: "user.update",
	validate: PreferenceSchema.validator(),
	run(preferences) {
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
