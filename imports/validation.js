import moment from "moment-timezone";

moment.tz.setDefault("Etc/UTC");

const validRR = /^(BNSF|UP|CSX|NS|CN|CP|KCS)$/;

const states = ["AL", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "ID",
	"IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
	"NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
	"SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

const upSymbol = /^([ACIKMOQUZ]|G[SELS])[A-Z1-5]{4}[BCELPXR]?$/;
const bnsfSymbol = /^[BCEGHMQSUVXZ][A-Z]{6}[1-9]?$/;
const csxSymbol = /^[A-Z][0-9]{3}$/;
const nsSymbol = /^([A-Z]{1,2}\d{1,2}|\d{3}|\d{2}[A-Z])$/;
const cpSymbol = /^2?\d{3}$/; // extras might be 2NNN?
const cnSymbol = /^[A-Z]{1}\d{3,5}$/;
const kcsSymbol = /^[ACDGHILMORSUWX][A-Z]{4}$/;

export const valSymbol = (symbol, railroad) => {
	switch (railroad) {
		case "UP":
			return upSymbol.test(symbol);
		case "BNSF":
			return bnsfSymbol.test(symbol);
		case "CSX":
			return csxSymbol.test(symbol);
		case "NS":
			return nsSymbol.test(symbol);
		case "CP":
			return cpSymbol.test(symbol);
		case "CN":
			return cnSymbol.test(symbol);
		case "KCS":
			return kcsSymbol.test(symbol);
		default:
			return false;
	}
};

export const valDateTime = (dateTime) => {
	// returns true if valid, otherwise an error message
	const realDateTime = moment(dateTime, "MM-DD-YY HH:mm");
	const fiveYearsAgo = moment().subtract(5, "years");
	const now = moment();
	if (realDateTime.isValid()) {
		if (!moment(realDateTime).isBetween(fiveYearsAgo, now)) {
			return "Must be within the last five years";
		}
		return true;
	}
	return "Invalid date";
};

export const cleanLocation = (location) => {
	// first make sure field is not empty, to avoid error during .replace
	if (typeof location !== "string" || !location.length) {
		return [];
	}
	// return array with only alphabetic chars split on commas. considered leaving spaces
	// in for city names that include spaces, but that could lead to bugs
	// with the split the way it is (i.e. state could be " AZ" instead of "AZ")
	return location.toUpperCase().replace(/[^A-Z,]/g, "").split(",");
};

export const valLocation = (location) => {
	// returns true if valid, otherwise an error message
	if (location && location.length > 30) {
		return "Too many characters!";
	}
	const locArray = cleanLocation(location);
	// this detects lack of comma or insufficient details
	if (locArray.length < 2) {
		return "Must include City and State, separated by commas";
	}
	if (!states.includes(locArray[locArray.length - 1])) {
		return "Last part must be a two letter state, i.e. AZ";
	}
	if (locArray.length >= 4) {
		return "Too specific. Must include state and one or two other parameters";
	}
	return true;
};


/* **** FORM SPECIFIC VALIDATION **** */

export const preferenceValidation = (values) => {
	const { railroad, location } = values;
	const locationTest = valLocation(location);
	return {
		railroad: railroad && !validRR.test(railroad) ? "Please enter a valid RR" : null,
		location: location && locationTest !== true ? locationTest : null
	};
};

export const submitValidation = (values) => {
	const { railroad, location, symbol, dateTime } = values;
	// only keep non-word characters and , split on commas
	// does location have at least two parts, (hopefully city, state || yard, state... etc)
	// and if so, does it really contain a two letter state?
	const dateTest = valDateTime(dateTime);
	const locationTest = valLocation(location);
	return {
		railroad: !validRR.test(railroad) ? "Please enter a valid RR" : null,
		location: locationTest !== true ? locationTest : null,
		symbol: !valSymbol(symbol, railroad) ? "Invalid symbol" : null,
		dateTime: dateTest !== true ? dateTest : null
	};
};

export const queryValidation = (values) => {
	const { railroad, location, symbol } = values;
	// predicting problems with this if there is no location
	const locationTest = valLocation(location);
	return {
		railroad: railroad && !validRR.test(railroad) ? "Please enter a valid RR" : null,
		location: location && locationTest !== true ? locationTest : null,
		symbol: symbol && !valSymbol(symbol, railroad) ? "Invalid symbol" : null
	};
};
