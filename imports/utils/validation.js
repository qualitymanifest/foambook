import { DateTime, Interval, Settings } from "luxon";

import statesMap from "./statesMap";
import {
  MAX_CITY_LEN,
  ERROR_NO_DESCRIPTION,
  DATETIME_FORMAT,
  TZ_DEFAULT
} from "./constants";

Settings.defaultZoneName = TZ_DEFAULT;
const validRR = /^(BNSF|UP|CSX|NS|CN|CP|KCS|PAR|PAS)$/;

const upSymbol = /(^([ACIKMOQUZ]|G[SELS])[A-Z1-5]{4}[BCELPXR]?)$|^([A-Z]{3}\d{2}[A-Z]?)$/;
const bnsfSymbol = /^[BCEGHMQSUVXZ][A-Z]{6}[1-9]?$/;
const csxSymbol = /^[A-Z][0-9]{3}$/;
const nsSymbol = /^([A-Z]{1,2}\d{1,2}|\d{3}|\d{2}[A-Z])$/;
const cpSymbol = /^2?\d{3}$/; // extras might be 2NNN?
const cnSymbol = /^[A-Z]{1}\d{3,5}$/;
const kcsSymbol = /^[ACDGHILMORSUWX][A-Z]{4}$/;
const parSymbol = /^[A-Z]{4}|\d{3}[A-Z]{2}|[A-Z]{2}\d{3}$/;

const validSymbol = (symbol, railroad) => {
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

export const cleanCity = city => {
  // remove all non-letters, and spaces that don't have a letter following
  // then remove a leading space
  return city
    .toUpperCase()
    .replace(/([^A-Z ]|\s(?![A-Z]))/g, "")
    .replace(/^ /, "");
};

export const validComment = comment => {
  if (!comment) {
    return ERROR_NO_DESCRIPTION;
  }
  return comment.length < 5 || comment.length > 300
    ? "Comments must be between 5 and 300 characters"
    : null;
};

export const validFlag = reason => {
  if (!reason) {
    return ERROR_NO_DESCRIPTION;
  }
  return reason.length < 5 || reason.length > 100
    ? "Must be 5 to 100 characters"
    : null;
};

/* **** PREFERENCE SPECIFIC VALIDATION **** */
// It's okay to leave preferences empty
export const validPrefRailroad = railroad => {
  const casedRailroad = railroad.toUpperCase();
  return casedRailroad && !validRR.test(casedRailroad)
    ? "Invalid railroad"
    : null;
};

export const validPrefCity = city => {
  return city && city.length > MAX_CITY_LEN ? ERROR_NO_DESCRIPTION : null;
};

export const validPrefState = state => {
  const casedState = state.toUpperCase();
  return casedState && !statesMap[casedState] ? ERROR_NO_DESCRIPTION : null;
};

/* **** SUBMIT SPECIFIC VALIDATION **** */

export const validSubRailroad = railroad => {
  if (!railroad) {
    return ERROR_NO_DESCRIPTION;
  }
  const casedRailroad = railroad.toUpperCase();
  return !validRR.test(casedRailroad) ? "Invalid railroad" : null;
};

export const validSubCity = city => {
  const cleansedCity = cleanCity(city);
  return !cleansedCity || cleansedCity.length > MAX_CITY_LEN
    ? ERROR_NO_DESCRIPTION
    : null;
};

export const validSubState = state => {
  const casedState = state.toUpperCase();
  return !casedState || !statesMap[casedState] ? ERROR_NO_DESCRIPTION : null;
};

export const validSubSymbol = (symbol, otherVals) => {
  if (!symbol) {
    return ERROR_NO_DESCRIPTION;
  }
  const casedRailroad = otherVals.railroad.toUpperCase();
  if (!casedRailroad) return "Railroad not provided";
  const casedSymbol = symbol.toUpperCase();
  return !validSymbol(casedSymbol, casedRailroad)
    ? `Invalid symbol for ${casedRailroad}`
    : null;
};

export const validSubDateTime = dateTime => {
  if (!dateTime) {
    return ERROR_NO_DESCRIPTION;
  }
  const luxonDateTime = DateTime.fromFormat(dateTime, DATETIME_FORMAT);
  const now = DateTime.local();
  const fiveYearsAgo = now.minus({ years: 5 });
  if (luxonDateTime.isValid) {
    if (!Interval.fromDateTimes(fiveYearsAgo, now).contains(luxonDateTime)) {
      return "Must be within the last five years";
    }
    return null;
  }
  return "Invalid date";
};
