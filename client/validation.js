import _ from 'lodash'
import moment from 'moment-timezone';
moment.tz.setDefault('Etc/UTC')

const upSymbol = /^[ACGIKMOQUZ][A-Z]{4}[BCELPX]?$/;
const bnsfSymbol = /^[BCEGHMQSUVXZ][A-Z]{6}[1-9]?$/;
const validTime = /^([01]\d|2[0-3])(00|30)?$/;
const validRR = /^(BNSF|UP|CSX|NS|CN|CP|PAR)$/;

const states = ["AL", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "ID",
 "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
  "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
   "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

export const cleanLocation = (location) => location.replace(/[^A-Z,]/g, '').split(',')

const valDateTime = (dateTime) => {
	dateTime =  moment(dateTime, 'MM-DD-YY HH:mm')
	const fiveYearsAgo = moment().subtract(5, 'years');
	const now = moment();
	if (dateTime.isValid()) {
		if ( ! moment(dateTime).isBetween(fiveYearsAgo, now) ) {
			return "Must be within the last five years"
		}
		return true;
	}
	return "Invalid date";
}


export const validation = (values) => {
	const { railroad, location, symbol, dateTime } = values;
	// only keep non-word characters and , split on commas
	let loc = cleanLocation(location)
	// does location have at least two parts, (hopefully city, state || yard, state... etc)
	// and if so, does it really contain a two letter state?
	let properLocation = loc.length >= 2 && Array.from( loc.map(el => states.includes(el)) ).includes(true) 
	let dateTest = valDateTime(dateTime)
	return {
		railroad : railroad !== "UP" ? 'Please enter a valid RR' : null,
		location : !properLocation ? 'Must include state initials and city and/or yard name' : null,
		symbol : !upSymbol.test(symbol) ? 'Invalid symbol' : null,
		dateTime : dateTest !== true ? dateTest : null
	}
}