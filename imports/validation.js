import moment from "moment-timezone";

moment.tz.setDefault("Etc/UTC");

export const statesMap = {
  "AL" : "ALABAMA",
  "AK" : "ALASKA",
  "AZ" : "ARIZONA",
  "AR" : "ARKANSAS",
  "CA" : "CALIFORNIA",
  "CO" : "COLORADO",
  "CT" : "CONNECTICUT",
  "DE" : "DELAWARE",
  "DC" : "WASHINGTON DC",
  "FL" : "FLORIDA",
  "GA" : "GEORGIA",
  "ID" : "IDAHO",
  "IL" : "ILLINOIS",
  "IN" : "INDIANA",
  "IA" : "IOWA",
  "KS" : "KANSAS",
  "KY" : "KENTUCKY",
  "LA" : "LOUISIANA",
  "ME" : "MAINE",
  "MD" : "MARYLAND",
  "MA" : "MASSACHUSETTS",
  "MI" : "MICHIGAN",
  "MN" : "MINNESOTA",
  "MS" : "MISSISSIPPI",
  "MO" : "MISSOURI",
  "MT" : "MONTANA",
  "NE" : "NEBRASKA",
  "NV" : "NEVADA",
  "NH" : "NEW HAMPSHIRE",
  "NJ" : "NEW JERSEY",
  "NM" : "NEW MEXICO",
  "NY" : "NEW YORK",
  "NC" : "NORTH CAROLINA",
  "ND" : "NORTH DAKOTA",
  "OH" : "OHIO",
  "OK" : "OKLAHOMA",
  "OR" : "OREGON",
  "PA" : "PENNSYLVANIA",
  "RI" : "RHODE ISLAND",
  "SC" : "SOUTH CAROLINA",
  "SD" : "SOUTH DAKOTA",
  "TN" : "TENNESSEE",
  "TX" : "TEXAS",
  "UT" : "UTAH",
  "VT" : "VERMONT",
  "VA" : "VIRGINIA",
  "WA" : "WASHINGTON",
  "WV" : "WEST VIRGINIA",
  "WI" : "WISCONSIN",
  "WY" : "WYOMING",
  "AB" : "ALBERTA",
  "BC" : "BRITISH COLUMBIA",
  "MB" : "MANITOBA",
  "NB" : "NEW BRUNSWICK",
  "NL" : "NEWFOUNDLAND/LABRADOR",
  "NS" : "NOVA SCOTIA",
  "NT" : "NORTHWEST TERRITORIES",
  "ON" : "ONTARIO",
  "QC" : "QUEBEC",
  "SK" : "SASKATCHEWAN",
  "YT" : "YUKON"
}

const validRR = /^(BNSF|UP|CSX|NS|CN|CP|KCS|PAR|PAS)$/;

const upSymbol = /^([ACIKMOQUZ]|G[SELS])[A-Z1-5]{4}[BCELPXR]?$/;
const bnsfSymbol = /^[BCEGHMQSUVXZ][A-Z]{6}[1-9]?$/;
const csxSymbol = /^[A-Z][0-9]{3}$/;
const nsSymbol = /^([A-Z]{1,2}\d{1,2}|\d{3}|\d{2}[A-Z])$/;
const cpSymbol = /^2?\d{3}$/; // extras might be 2NNN?
const cnSymbol = /^[A-Z]{1}\d{3,5}$/;
const kcsSymbol = /^[ACDGHILMORSUWX][A-Z]{4}$/;
const parSymbol = /^[A-Z]{4}|\d{3}[A-Z]{2}|[A-Z]{2}\d{3}$/;

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
		case "PAR":
		case "PAS":
			return parSymbol.test(symbol);
		default:
			return false;
	}
};

export const valDateTime = (dateTime) => {
	// returns true if valid, otherwise an error message
	const fullDateTime = /^\d{2}-\d{2}-\d{2} \d{2}:\d{2}$/;
	// Moment will turn dates without time into valid dates
	if (!fullDateTime.test(dateTime)) {
		return "Incomplete date/time";
	}
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
	// return array with everything other than alphabetic chars and single spaces removed
	// also remove single spaces if they precede or follow a comma
	return location.toUpperCase().replace(/[^A-Z, ]| {2,}| (?=,)/g, "").replace(/, /g, ",").split(",");
};

export const valLocation = (location) => {
	// returns true if valid, otherwise an error message
	if (location && location.length > 30) {
		return "Sorry, too many characters!";
	}
	const locArray = cleanLocation(location);
	// this detects lack of comma or insufficient details
	if (locArray.length < 2) {
		return "Must include city and state, separated by commas";
	}
	if (!statesMap[locArray[locArray.length - 1]]) {
		return "Last part must be a two letter state, i.e. AZ";
	}
	if (locArray.includes("")) {
		return "Cannot leave empty fields";
	}
	if (locArray.length >= 4) {
		return "Too specific. Must include state and one or two other parameters";
	}
	return true;
};


/* **** PREFERENCE SPECIFIC VALIDATION **** */

export const validPrefRailroad = railroad => {
	railroad = railroad ? railroad.toUpperCase() : "";
	// It's okay to leave preferences empty
	return railroad && !validRR.test(railroad) ? "Invalid railroad" : null;
}

export const validPrefLocation = location => {
	const locationTest = valLocation(location);
	// It's okay to leave preferences empty
	return location && locationTest !== true ? locationTest : null
}

/* **** SUBMIT SPECIFIC VALIDATION **** */

export const validSubRailroad = railroad => {
	railroad = railroad ? railroad.toUpperCase() : "";
	return !validRR.test(railroad) ? "Invalid railroad" : null;
}

export const validSubLocation = loc => {
	const locationTest = valLocation(loc)
	return locationTest !== true ? locationTest : null;
}

export const validSubSymbol = (symbol, otherVals) => {
	symbol = symbol ? symbol.toUpperCase() : "";
	const railroad = otherVals.railroad ? otherVals.railroad.toUpperCase() : "";
	return !valSymbol(symbol, railroad) ? "Invalid symbol" : null;
}

export const validSubDateTime = dateTime => {
	const dateTest = valDateTime(dateTime);
	return dateTest !== true ? dateTest : null;
}