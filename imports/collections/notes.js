import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import Moment from "moment";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";

// https://guide.meteor.com/collections.html#schemas-on-write

export const Notes = new Mongo.Collection("notes");

const NotesSchema = new SimpleSchema({
	railroad: { type: String, max: 10 },
	location: { type: Array, minCount: 2, maxCount: 3 },
	"location.$": { type: String, max: 20 },
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
			{ userId: Meteor.userId(), createdAt: Moment().format("x") }
		);
		Notes.insert(note);
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
	}
});

const PreferenceSchema = new SimpleSchema({
	railroad: { type: String, max: 10, optional: true },
	location: { type: Array, minCount: 2, maxCount: 3, optional: true },
	"location.$": { type: String, max: 20 },
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
