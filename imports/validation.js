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

export const cleanCity = city => {
	// remove all non-letters, and spaces that don't have a letter following
	// then remove a leading space
	return city.toUpperCase().replace(/([^A-Z ]|\s(?![A-Z]))/g, "").replace(/^ /, "");
};

export const validComment = comment => {
	if (!comment) { return "error-no-description" };
	return comment.length < 10 || comment.length > 300 ? "Comments must be between 10 and 300 characters" : null;
}


/* **** PREFERENCE SPECIFIC VALIDATION **** */
// It's okay to leave preferences empty
export const validPrefRailroad = railroad => {
	railroad = railroad ? railroad.toUpperCase() : "";
	return railroad && !validRR.test(railroad) ? "Invalid railroad" : null;
}

export const validPrefCity = city => {
	return city && city.length > 30 ? "error-no-description" : null;
}

export const validPrefState = state => {
  if (state) {state = state.toUpperCase()}
	return state && !statesMap[state] ? "error-no-description" : null;
}

/* **** SUBMIT SPECIFIC VALIDATION **** */

export const validSubRailroad = railroad => {
	if (!railroad) { return "error-no-description" };
	railroad = railroad.toUpperCase();
	return !validRR.test(railroad) ? "Invalid railroad" : null;
}

export const validSubCity = city => {
	city = cleanCity(city);
	return !city || city.length > 30 ? "error-no-description" : null;
}

export const validSubState = state => {
  if (state) {state = state.toUpperCase()}
	return !state || !statesMap[state] ? "error-no-description" : null;
}

export const validSubSymbol = (symbol, otherVals) => {
	if (!symbol) { return "error-no-description" };
	symbol = symbol.toUpperCase();
	const railroad = otherVals.railroad ? otherVals.railroad.toUpperCase() : "";
	return !railroad ? "Railroad not provided" : !valSymbol(symbol, railroad) ? `Invalid symbol for ${railroad}` : null;
}

export const validSubDateTime = dateTime => {
	if (!dateTime) { return "error-no-description" };
	const dateTest = valDateTime(dateTime);
	return dateTest !== true ? dateTest : null;
}