# todo:
- change query page:
	- remove table of query results
	- change from a form to a list of locations organized by state, with the amount of notes for each location shown alongside.
	-	when a location is clicked, show a list of symbols separated by railroad, with amount of notes for each symbol shown alongside
	- finally, when a symbol is clicked, show scatterplot

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