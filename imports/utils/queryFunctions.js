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

export const getAgeClass = date => {
  if (date > monthAgo) {
    return "pastMonth";
  }
  if (date > yearAgo) {
    return "pastYear";
  }
  return "olderThanYear";
};

const getNewer = (a, b) => (a > b ? a : b);

export const processLocations = rawLocations => {
  // There can be multiple cities per state and multiple railroads per city
  // Condense them using a Map to preserve their original sorted order
  // The mostRecent field is NOT sorted
  const states = new Map();
  rawLocations.forEach(location => {
    const { city, state, count, mostRecent } = location;
    const existingState = states.get(state);
    if (existingState) {
      existingState.count += count;
      existingState.mostRecent = getNewer(mostRecent, existingState.mostRecent);
      const existingCity = existingState.cities.get(city);
      if (existingCity) {
        existingCity.count += count;
        existingCity.mostRecent = getNewer(mostRecent, existingCity.mostRecent);
        existingState.cities.set(city, existingCity);
      } else {
        existingState.cities.set(city, { count, mostRecent });
      }
      states.set(state, existingState);
    } else {
      states.set(state, {
        cities: new Map([[city, { count, mostRecent }]]),
        state,
        count,
        mostRecent
      });
    }
  });
  return Array.from(states);
};

export const railroadSorter = rawRailroads => {
  return rawRailroads.sort((a, b) => {
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
