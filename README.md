# todo

- deciding to show page to user or not based on auth:
	- subscription starts out as null, and stays null if not logged in. this presents some problems telling whether page is loading or user just isnt logged in. potential solutions :
		- could set userid prop to a default, that way if it turns out null we know they're not logged in?
		- https://guide.meteor.com/data-loading.html#readiness

- switch to objectId with timestamp

- user page
	- preferences form
	- preferences methods
	- allow for note deletion
	- pass note deletion func into notes_table

- query page
	-	d3!
	- filtering options

- regulate how often DB can be submitted to / queried

- form validation for:
	- other railroads
	- other railroads' symbols

- mobile form datetime
	- react-datetime looks promising
	- separate datetime input for mobile - https://goshakkk.name/different-mobile-desktop-tablet-layouts-react/

- sharing url of search results to others:
	- https://guide.meteor.com/data-loading.html#changing-arguments
	- or, a share button that generates url with params in, and give component logic to try to parse these on load