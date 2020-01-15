export const QUERY_NOT_FOUND =
  "There were no results to that query. Either you followed a bad link, or the notes for this category were recently deleted";
export const ERROR_NO_DESCRIPTION = "ERROR_NO_DESCRIPTION";
export const STATUS_APPROVED = "APPROVED";
export const AGGREGATE_LOCATIONS = "AGGREGATE_LOCATIONS";
export const AGGREGATE_SYMBOLS = "AGGREGATE_SYMBOLS";
export const SORT_TYPES = {
  ALPHA: "ALPHA",
  RECENT: "RECENT",
  COUNT: "COUNT"
};

export const MAX_RR_LEN = 10;
export const MAX_CITY_LEN = 30;
export const MAX_STATE_LEN = 2;
export const MAX_SYMBOL_LEN = 10;
export const FORM_DEBOUNCE_MS = 200;
export const SECOND_MS = 1000;
export const MINUTE_MS = SECOND_MS * 60;
export const HOUR_MS = MINUTE_MS * 60;

export const DATETIME_FORMAT = "LL-dd-yy HH:mm";
export const DATETIME_FORMAT_SHORT = "MM-dd-yyyy";
export const ZONES = {
  PST: "America/Los_Angeles",
  AZ: "America/Phoenix",
  MST: "America/Denver",
  CST: "America/Chicago",
  EST: "America/New_York",
  AST: "America/Moncton",
  UTC: "Etc/UTC"
};
export const TZ_DEFAULT = ZONES.UTC;
