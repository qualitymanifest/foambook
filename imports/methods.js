import Moment from "moment-timezone";
import { encode } from "he";
import XLSX from "xlsx";

import { FlagsInsert } from "./collections/flags";
import { NotesDelete, UserUpdate, NotesInsert } from "./collections/notes";
import { CommentsInsert, CommentsDelete } from "./collections/comments";
import { cleanCity } from "./utils/validation";
import { DATETIME_FORMAT, TZ_DEFAULT } from "./utils/constants";

Moment.tz.setDefault(TZ_DEFAULT);

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
	valuesCopy.dateTime = Moment(valuesCopy.dateTime, DATETIME_FORMAT).toDate();
	apiHandle.setValue("symbol", "")
	NotesInsert.call(valuesCopy, (err) => {
		if (err) {
			alert(err);
		}
	});
};

export const commentSubmitMethod = (formValues, query, setExpanded, apiHandle) => {
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
			setExpanded(false);
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

export const flagSubmitMethod = (flag, setVisible, setSuccess) => {
	FlagsInsert.call(flag, (err) => {
		if (err) {
			alert(err);
		}
		else {
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
		XLSX.writeFile(wb, "foambook_notes.xlsx");
	});
}
