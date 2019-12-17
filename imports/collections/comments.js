import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import { DateTime, Settings } from "luxon";

import {
  MAX_CITY_LEN,
  MAX_STATE_LEN,
  MAX_RR_LEN,
  MAX_SYMBOL_LEN,
  STATUS_APPROVED,
  TZ_DEFAULT,
  ZONES
} from "../utils/constants";

Settings.defaultZoneName = TZ_DEFAULT;

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

    const commentWithMetadata = {
      ...comment, // eslint-disable-line
      userId: Meteor.userId(),
      userName: Meteor.user().profile.name,
      createdAt: DateTime.fromObject({ zone: ZONES.EST }).toMillis()
    };
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
