import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { DateTime } from "luxon";
import SimpleSchema from "simpl-schema";
import { ValidatedMethod } from "meteor/mdg:validated-method";

import {
  MAX_CITY_LEN,
  MAX_STATE_LEN,
  MAX_RR_LEN,
  MAX_SYMBOL_LEN,
  STATUS_APPROVED,
  ZONES
} from "../utils/constants";

// https://guide.meteor.com/collections.html#schemas-on-write

export const Notes = new Mongo.Collection("notes");

const NotesSchema = new SimpleSchema({
  railroad: { type: String, max: MAX_RR_LEN },
  city: { type: String, max: MAX_CITY_LEN },
  state: { type: String, max: MAX_STATE_LEN },
  symbol: { type: String, max: MAX_SYMBOL_LEN },
  dateTime: { type: Date }
});
export const NotesInsert = new ValidatedMethod({
  name: "notes.insert",
  validate: NotesSchema.validator(),
  run(train) {
    if (!Meteor.userId() || Meteor.user().status !== STATUS_APPROVED) {
      throw new Meteor.Error("not-authorized");
    }
    const note = {
      ...train,
      userId: Meteor.userId(),
      createdAt: DateTime.fromObject({ zone: ZONES.UTC }).toFormat("x")
    };
    Notes.insert(note);
    Meteor.users.update(Meteor.userId(), { $inc: { notesCount: 1 } });
  }
});

const DeleteSchema = new SimpleSchema({
  noteId: { type: String, regEx: /^[A-Za-z0-9]{17}$/ }
});
export const NotesDelete = new ValidatedMethod({
  name: "notes.delete",
  validate: DeleteSchema.validator(),
  run({ noteId }) {
    if (!Meteor.userId() || Meteor.user().status !== STATUS_APPROVED) {
      throw new Meteor.Error("not-authorized");
    }
    Notes.remove({ userId: Meteor.userId(), _id: noteId });
    Meteor.users.update(Meteor.userId(), { $inc: { notesCount: -1 } });
  }
});

const PreferenceSchema = new SimpleSchema({
  railroad: { type: String, max: MAX_RR_LEN, optional: true },
  city: { type: String, max: MAX_CITY_LEN, optional: true },
  state: { type: String, max: MAX_STATE_LEN, optional: true },
  timezone: { type: String, max: 20 }
});
export const UserUpdate = new ValidatedMethod({
  name: "user.update",
  validate: PreferenceSchema.validator(),
  run(preferences) {
    if (!Meteor.userId() || Meteor.user().status !== STATUS_APPROVED) {
      throw new Meteor.Error("not-authorized");
    }
    Meteor.users.update(Meteor.userId(), {
      $set: {
        preferences
      }
    });
  }
});
