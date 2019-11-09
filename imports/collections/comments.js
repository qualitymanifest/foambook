import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import moment from "moment-timezone";

import { MAX_CITY_LEN, MAX_STATE_LEN, MAX_RR_LEN, MAX_SYMBOL_LEN, STATUS_APPROVED } from "../utils/constants";

moment.tz.setDefault("Etc/UTC");

export const Comments = new Mongo.Collection("comments");

const CommentsSchema = new SimpleSchema({
	railroad: { type: String, max: MAX_RR_LEN },
	city: { type: String, max: MAX_CITY_LEN },
	state: { type: String, max: MAX_STATE_LEN },
	symbol: { type: String, max: MAX_SYMBOL_LEN },
	comment: { type: String } // leaving out max due to encoding
});
export const CommentsInsert = new ValidatedMethod({
	name: "comments.insert",
	validate: CommentsSchema.validator(),
	run(comment) {
		if (!Meteor.userId() || Meteor.user().status !== STATUS_APPROVED) {
			throw new Meteor.Error("not-authorized");
		}
		const commentWithMetadata = Object.assign(
			{},
			comment,
			{ userId: Meteor.userId(), userName: Meteor.user().profile.name, createdAt: Number(moment().tz("America/New_York").format("x")) }
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
		if (!Meteor.userId() || Meteor.user().status !== STATUS_APPROVED) {
			throw new Meteor.Error("not-authorized");
		}
		Comments.remove({ userId: Meteor.userId(), _id: commentId });
	}
});