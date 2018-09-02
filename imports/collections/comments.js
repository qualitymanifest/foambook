import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import moment from "moment-timezone";

moment.tz.setDefault("Etc/UTC");

export const Comments = new Mongo.Collection("comments");

const CommentsSchema = new SimpleSchema({
	railroad: { type: String, max: 10 },
	city: { type: String, max: 30 },
	state: { type: String, max: 2 },
	symbol: { type: String, max: 10 },
	comment: { type: String } // leaving out max due to encoding
});
export const CommentsInsert = new ValidatedMethod({
	name: "comments.insert",
	validate: CommentsSchema.validator(),
	run(comment) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		const commentWithMetadata = Object.assign(
			{},
			comment,
			{ userId: Meteor.userId(), userName: Meteor.user().profile.name, createdAt: Number(moment().format("x")) }
		);
		Comments.insert(commentWithMetadata);
	}
});

const DeleteSchema = new SimpleSchema({
	commentId: { type: String, regEx: /^[A-Za-z0-9]{17}$/ }
});
export const CommentsDelete = new ValidatedMethod({
	name: "comments.delete",
	validate: DeleteSchema.validator(),
	run({ commentId }) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		Comments.remove({ userId: Meteor.userId(), _id: commentId });
	}
});