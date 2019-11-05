import Moment from "moment-timezone";

Moment.tz.setDefault("Etc/UTC");
const monthAgo = Moment().subtract(1, "month");
const yearAgo = Moment().subtract(1, "year");

export const testAge = (mostRecent) => {
	if (mostRecent > monthAgo) {
		return "pastMonth";
	}
	if (mostRecent > yearAgo) {
		return "pastYear";
	}
	return "olderThanYear";
};

// meteor publishes randomly, even if DB is sorted:
export const locationSorter = (rawLocations) => {
	const locations = rawLocations.sort((a, b) => {
		return (a._id > b._id) ? 1 : -1;
	});
	locations.forEach((state) => {
		state.cities.sort((a, b) => (a.city > b.city) ? 1 : -1);
	});
	return locations;
};

export const railroadSorter = (rawRailroads) => {
	return rawRailroads[0].railroads.sort((a, b) => {
		return (a.railroad > b.railroad) ? 1 : -1;
	});
};

export const symbolSorter = (symbols, sortType) => {
	if (sortType === "alpha") {
		return symbols.sort((a, b) => (a.symbol > b.symbol) ? 1 : -1);
	}
	if (sortType === "recent") {
		return symbols.sort((a, b) => (a.mostRecent < b.mostRecent) ? 1 : -1);
	}
	// there may be many with the same count, so sort those alphabetically too
	if (sortType === "count") {
		return symbols.sort((a, b) => (a.count === b.count && a.symbol > b.symbol) ? 1 : (a.count < b.count) ? 1 : -1);
	}
};

export const commentsSorter = (comments, city, state) => {
	const localComments = [];
	const otherComments = [];
	comments.map((comment) => {
		if (comment.city === city && comment.state === state) {
			localComments.push(comment);
		}
		else {
			otherComments.push(comment);
		}
	});
	return { local: localComments, other: otherComments };
};

export const processNotes = (notes) => {
	const oldest = Moment(notes[0].dateTime);
	const newest = Moment(notes[notes.length - 1].dateTime);
	const years = [];
	const newNotes = [];
	notes.map((note) => {
		const newNote = Object.assign({}, note);
		const noteMoment = Moment(note.dateTime);
		newNote.time = (noteMoment.hours() * 60) + noteMoment.minutes();
		newNote.weekday = noteMoment.isoWeekday();
		newNotes.push(newNote);
		if (!years.includes(noteMoment.year())) {
			years.push(noteMoment.year());
		}
	});
	return { notes: newNotes, oldest, newest, years };
};
