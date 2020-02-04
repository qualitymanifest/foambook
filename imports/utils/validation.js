import { DateTime, Interval, Settings } from "luxon";

import statesMap from "./statesMap";
import {
  MAX_CITY_LEN,
  ERROR_NO_DESCRIPTION,
  DATETIME_FORMAT,
  TZ_DEFAULT
} from "./constants";

Settings.defaultZoneName = TZ_DEFAULT;

const symbols = {
  UP: /(^([ACIKMOQUZ]|G[SELS])[A-Z1-5]{4}[BCELPXR]?)$|^([A-Z]{3}\d{2}[A-Z]?)$/,
  BNSF: /^[BCEGHMQSUVXZ][A-Z]{6}[1-9]?$/,
  CSX: /^[A-Z][0-9]{3}$/,
  NS: /^([A-Z]{1,2}\d{1,2}|\d{3}|\d{2}[A-Z])$/,
  CP: /^2?\d{3}$/,
  CN: /^[A-Z]{1}\d{3,5}$/,
  KCS: /^[ACDGHILMORSUWX][A-Z]{4}$/,
  PAR: /^([A-Z]{4}|\d{3}[A-Z]{2}|[A-Z]{2}\d{3})$/,
  get PAS() {
    return this.PAR;
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
  return casedRailroad && !symbols[casedRailroad] ? "Invalid railroad" : null;
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
  return !symbols[casedRailroad] ? "Invalid railroad" : null;
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
  return !symbols[casedRailroad].test(casedSymbol)
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
