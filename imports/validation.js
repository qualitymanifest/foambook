import moment from 'moment-timezone';

moment.tz.setDefault('Etc/UTC');

const upSymbol = /^[ACGIKMOQUZ][A-Z]{4}[BCELPX]?$/;
const bnsfSymbol = /^[BCEGHMQSUVXZ][A-Z]{6}[1-9]?$/;
const validRR = /^(BNSF|UP|CSX|NS|CN|CP|PAR)$/;

const states = ['AL', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'ID',
 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT',
  'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
   'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

export const cleanLocation = (location) => {
	// first make sure field is not empty, to avoid error during .replace
	if (typeof location !== 'string' || !location.length) {
		return [];
	}
	// return array with only alphabetic chars
	return location.replace(/[^A-Z,]/g, '').split(',');
};


export const valDateTime = (dateTime) => {
	// returns true if valid, otherwise an error message
	const realDateTime = moment(dateTime, 'MM-DD-YY HH:mm');
	const fiveYearsAgo = moment().subtract(5, 'years');
	const now = moment();
	if (realDateTime.isValid()) {
		if (!moment(realDateTime).isBetween(fiveYearsAgo, now)) {
			return 'Must be within the last five years';
		}
		return true;
	}
	return 'Invalid date';
};

export const valSymbol = (symbol, railroad) => {
	switch (railroad) {
		case 'UP':
			return upSymbol.test(symbol);
		case 'BNSF':
			return bnsfSymbol.test(symbol);
		default:
			return false;
	}
};

export const valLocation = (location) => {
	// returns true if valid, otherwise an error message
	const locArray = cleanLocation(location);
	// this detects lack of commas or insufficient
	if (locArray.length < 2) {
		return 'Must include state, and city/yard/city&yard, seperated by commas';
	}
	if (!Array.from(locArray.map(el => states.includes(el))).includes(true)) {
		return 'Must include a two letter state, i.e. AZ';
	}
	return true;
};


export const validation = (values) => {
	const { railroad, location, symbol, dateTime } = values;
	// only keep non-word characters and , split on commas
	// does location have at least two parts, (hopefully city, state || yard, state... etc)
	// and if so, does it really contain a two letter state?
	const dateTest = valDateTime(dateTime);
	const locationTest = valLocation(location);
	return {
		railroad: !validRR.test(railroad) ? 'Please enter a valid RR' : null,
		location: locationTest !== true ? locationTest : null,
		symbol: !validRR.test(railroad) ? 'Enter RR before symbol' : !valSymbol(symbol, railroad) ? 'Invalid symbol' : null,
		dateTime: dateTest !== true ? dateTest : null,
	};
};
