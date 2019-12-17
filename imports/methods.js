import { Meteor } from "meteor/meteor";
import { DateTime, Settings } from "luxon";
import { encode } from "he";

import { NotesDelete, UserUpdate, NotesInsert } from "./collections/notes";
import { CommentsInsert, CommentsDelete } from "./collections/comments";
import { cleanCity } from "./utils/validation";
import { DATETIME_FORMAT, TZ_DEFAULT } from "./utils/constants";

Settings.defaultZoneName = TZ_DEFAULT;

export const preferenceSubmitMethod = ({ railroad, city, state, timezone }) => {
  const parsedValues = {
    railroad: railroad.toUpperCase(),
    city: cleanCity(city.toUpperCase()),
    state: state.toUpperCase(),
    timezone
  };
  UserUpdate.call(parsedValues, err => {
    if (err) {
      alert(err);
    }
  });
};

export const notesDeleteMethod = noteId => {
  NotesDelete.call({ noteId }, err => {
    if (err) {
      alert(err);
    }
  });
};

export const noteSubmitMethod = (values, apiHandle) => {
  const { railroad, city, state, symbol, dateTime } = values;
  const parsedValues = {
    railroad: railroad.toUpperCase(),
    city: cleanCity(city.toUpperCase()),
    state: state.toUpperCase(),
    symbol: symbol.toUpperCase(),
    dateTime: DateTime.fromFormat(dateTime, DATETIME_FORMAT).toJSDate()
  };
  apiHandle.setValue("symbol", "");
  NotesInsert.call(parsedValues, err => {
    if (err) {
      alert(err);
    }
  });
};

export const commentSubmitMethod = (
  formValues,
  query,
  setExpanded,
  apiHandle
) => {
  const cleansedComment = encode(formValues.comment);
  const comment = {
    comment: cleansedComment,
    city: query.city,
    state: query.state,
    railroad: query.railroad,
    symbol: query.symbol
  };
  CommentsInsert.call(comment, err => {
    if (err) {
      alert(err);
    } else {
      setExpanded(false);
      apiHandle.setValue("comment", "");
    }
  });
};

export const commentsDeleteMethod = commentId => {
  CommentsDelete.call({ commentId }, err => {
    if (err) {
      alert(err);
    }
  });
};

export const flagSubmitMethod = (flag, setVisible, setSuccess) => {
  Meteor.call("flagEmail", { flag, user: Meteor.userId() }, err => {
    if (err) {
      alert(err);
    } else {
      setSuccess(true);
      setTimeout(() => setVisible(false), 2500);
    }
  });
};

export const downloadMethod = () => {
  Meteor.call("download", null, (err, wb) => {
    if (err) {
      alert(err);
      return;
    }
    import("xlsx").then(XLSX => {
      XLSX.writeFile(wb, "foambook_notes.xlsx");
    });
  });
};
