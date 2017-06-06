# todo:
- if there are no query parameters, return a list of unique locations. locations should be links that, when clicked, populate search field, and return results
	- to create list of unique locations, seems to be two choices: figure out how to use mongodb's `.distinct()` within meteor, or create a cron job that, every x hours, queries for distinct locations, and populates a collection of distinct locations

- if only query parameter is location, include a list of unique symbols in results. maybe create this list on client side...?

- allow filtering by date range 


# backburner improvements:
- d3:
	- better tooltips
	- force / "jittering" to un-stack entries with same time/date

- mobile form datetime
	- react-datetime looks promising
	- separate datetime input for mobile - https://goshakkk.name/different-mobile-desktop-tablet-layouts-react/

- put query params in url & parse from url, to ease search result sharing

- query efficiency: only pull in fields that aren't part of the query, since if the query matches those documents, you already know what those fields are