import Moment from "moment-timezone";
import { encode } from "he";

import { FlagsInsert } from "./collections/flags";
import { NotesDelete, UserUpdate, NotesInsert } from "./collections/notes";
import { CommentsInsert, CommentsDelete } from "./collections/comments";
import { cleanCity } from "./validation";

Moment.tz.setDefault("Etc/UTC");

export const preferenceSubmitMethod = (values) => {
	const valuesCopy = Object.assign({}, values);
	if (valuesCopy.railroad) {
		valuesCopy.railroad = valuesCopy.railroad.toUpperCase();
	}
	if (valuesCopy.city) {
		valuesCopy.city = cleanCity(valuesCopy.city.toUpperCase());
	}
	if (valuesCopy.state) {
		valuesCopy.state = valuesCopy.state.toUpperCase();
	}
	UserUpdate.call(valuesCopy, (err) => {
		if (err) {
			alert(err);
		}
	});
};

export const notesDeleteMethod = (noteId) => {
	NotesDelete.call({ noteId }, (err) => {
		if (err) {
			alert(err);
		}
	});
};

export const noteSubmitMethod = (values, apiHandle) => {
	const valuesCopy = Object.assign({}, values);
	Object.keys(valuesCopy).map(key => valuesCopy[key] = valuesCopy[key].toUpperCase());
	valuesCopy.city = cleanCity(valuesCopy.city);
	valuesCopy.dateTime = Moment(valuesCopy.dateTime, "MM-DD-YY HH:mm").toDate();
	apiHandle.setValue("symbol", "")
	NotesInsert.call(valuesCopy, (err) => {
		if (err) {
			alert(err);
		}
	});
};

export const commentSubmitMethod = (formValues, query, toggleFunc, apiHandle) => {
	const cleansedComment = encode(formValues.comment);
	const comment = {
		comment: cleansedComment,
		city: query.city,
		state: query.state,
		railroad: query.railroad,
		symbol: query.symbol
	};
	CommentsInsert.call(comment, (err) => {
		if (err) {
			alert(err);
		}
		else {
			toggleFunc();
			apiHandle.setValue("comment", "");
		}
	});
};

export const commentsDeleteMethod = (commentId) => {
	CommentsDelete.call({ commentId }, (err) => {
		if (err) {
			alert(err);
		}
	});
};

export const flagSubmitMethod = (flag, handleClose, handleSuccess) => {
	FlagsInsert.call(flag, (err) => {
		if (err) {
			alert(err);
		}
		else {
			handleSuccess();
			setTimeout(() => handleClose(), 2500);
		}
	});
};
