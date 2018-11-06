import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import moment from "moment-timezone";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";

export const Flags = new Mongo.Collection("flags");

const FlagsSchema = new SimpleSchema({
	flagType: { type: String },
	problemId: { type: String },
	reason: { type: String } // leaving out max due to encoding
});
export const FlagsInsert = new ValidatedMethod({
	name: "flags.insert",
	validate: FlagsSchema.validator(),
	run(flag) {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}
		const flagWithMetadata = Object.assign(
			{},
			flag,
			{ userId: Meteor.userId(), createdAt: moment()._d }
		);
		Flags.insert(flagWithMetadata);
	}
});
