import moment from "moment-timezone";

moment.tz.setDefault("Etc/UTC");

const validRR = /^(BNSF|UP|CSX|NS|CN|CP|PAR)$/;

const states = ["AL", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "ID",
	"IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
	"NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
	"SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

export const cleanLocation = (location) => {
	// first make sure field is not empty, to avoid error during .replace
	if (typeof location !== "string" || !location.length) {
		return [];
	}
	// return array with only alphabetic chars. considered leaving spaces
	// in for city names that include spaces, but that could lead to bugs
	// with the split the way it is (i.e. state could be " AZ" instead of "AZ")
	return location.replace(/[^A-Z,]/g, "").split(",");
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

const upSymbol = /^[ACGIKMOQUZ][A-Z1-4]{4}[BCELPXR]?$/;
const bnsfSymbol = /^[BCEGHMQSUVXZ][A-Z]{6}[1-9]?$/;
export const valSymbol = (symbol, railroad) => {
	switch (railroad) {
		case "UP":
			return upSymbol.test(symbol);
		case "BNSF":
			return bnsfSymbol.test(symbol);
		default:
			return false;
	}
};

export const valLocation = (location) => {
	// returns true if valid, otherwise an error message
	if (location && location.length > 30) {
		return "Too many characters!";
	}
	const locArray = cleanLocation(location);
	// this detects lack of commas or insufficient details
	if (locArray.length < 2) {
		return "Must include city/yard/city&yard + state, seperated by commas";
	}
	if (!Array.from(locArray.map(el => states.includes(el))).includes(true)) {
		return "Must include a two letter state, i.e. AZ";
	}
	if (locArray.length > 3) {
		return "Too specific - use city/yard/city&yard + state only";
	}
	return true;
};

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
		symbol: symbol && !valSymbol(symbol, railroad) ? "Invalid symbol" : null,
	}
}

/* potential encapsulation for checking user state and loading defaults:
		in some kind of utility file :
		const getStatusAndSetDefaults = (user, appLocation) {
			if (!user) {
				return {isDefinitelyLoggedIn : false, returnValue: <div>You are not logged in!</div> }
			}
			if (user === "LOADING") {
				return {isDefinitelyLoggedIn: false, returnValue: <div>LOADING SPINNER</div>}
			}
			if (user.preferences) {
				return {isDefinitelyLoggedIn: true, returnValue:
					railroad : user.railroad ? user.railroad : "",
					location : user.location ? user.location : "",
					// this would need work depending on appLocation
					dateTime: user.timezone ? Moment().tz(user.timezone).format("MM-DD-YY HH:mm") : ""
				}
			}
			else {
				return {isDefinitelyLoggedIn: true, returnValue: null}
			}
		}
		then in render :

		let checkStatus = getStatusAndSetDefaults(this.props.user, "AddNoteForm")
		if (!checkStatus.isDefinitelyLoggedIn) {
			return checkStatus.returnValue;
		}
		else {
			const defaultValues = checkStatus.returnValue;
		}
*/
