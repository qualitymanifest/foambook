import { DateTime, Settings } from "luxon";

import { TZ_DEFAULT, SORT_TYPES } from "./constants";

Settings.defaultZoneName = TZ_DEFAULT;
const now = DateTime.local();
const monthAgo = now.minus({ months: 1 });
const yearAgo = now.minus({ years: 1 });

export const parseQueryString = () => {
  const queryString = new URLSearchParams(window.location.search);
  const parsed = {};
  Array.from(queryString).forEach(([key, val]) => {
    parsed[key] = val;
  });
  return parsed;
};

export const testAge = mostRecent => {
  if (mostRecent > monthAgo) {
    return "pastMonth";
  }
  if (mostRecent > yearAgo) {
    return "pastYear";
  }
  return "olderThanYear";
};

// Meteor publishes randomly, even if DB is sorted:
export const locationSorter = rawLocations => {
  const locations = rawLocations.sort((a, b) => {
    return a._id > b._id ? 1 : -1;
  });
  locations.forEach(state => {
    state.cities.sort((a, b) => (a.city > b.city ? 1 : -1));
  });
  return locations;
};

export const railroadSorter = rawRailroads => {
  return rawRailroads[0].railroads.sort((a, b) => {
    return a.railroad > b.railroad ? 1 : -1;
  });
};

export const symbolSorter = (symbols, sortType) => {
  switch (sortType) {
    case SORT_TYPES.ALPHA:
      return symbols.sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
    case SORT_TYPES.RECENT:
      return symbols.sort((a, b) => (a.mostRecent < b.mostRecent ? 1 : -1));
    case SORT_TYPES.COUNT:
      return symbols.sort((a, b) =>
        a.count < b.count || (a.count === b.count && a.symbol > b.symbol)
          ? 1
          : -1
      );
    default:
      return symbols;
  }
};

export const commentsSorter = (comments, city, state) => {
  const localComments = [];
  const otherComments = [];
  comments.forEach(comment => {
    if (comment.city === city && comment.state === state) {
      localComments.push(comment);
    } else {
      otherComments.push(comment);
    }
  });
  return { local: localComments, other: otherComments };
};

export const processNotes = notes => {
  const years = new Set();
  const processedNotes = notes.reduce((processed, { dateTime }) => {
    const luxonDateTime = DateTime.fromJSDate(dateTime);
    const { year, hour, minute, weekday } = luxonDateTime;
    years.add(year);
    processed.push({
      luxonDateTime,
      time: hour * 60 + minute,
      weekday,
      year
    });
    return processed;
  }, []);
  return { processedNotes, processedYears: Array.from(years) };
};
