# change log:
- REACTIVE AGGREGATION OF NOTES!
- Remove all references to "metadata" collection since it no longer exists
- Remove comment about metadata updates from readme
- If a field is empty, do not show an error message - just highlight in red and refuse submit

# todo:
- For better efficiency, aggregate states/cities, then when a location is selected, aggregate railroads/symbols?
	- This would require changes to the way that queries are validated

# backburner improvements:
- EITHER:
	- Add "events" field to submission form that pops open a multi-select with options like "CREW CHANGE, PICK UP, SET OUT, etc"
	- Figure out how to render events? probably no good way to do that in scatterplot, maybe something below the scatterplot that you can click to pop open that has DAY OF WEEK | DATETIME | EVENTS LIST
- OR:
	- Add comment-section style area underneath scatterplot, where each user can leave one (editable) message about what that train typically does there


# notes:
- Check to see if withTracker is being used correctly: https://atmospherejs.com/meteor/react-meteor-data
- Loading spinner appears to stall the app occasionally when using chrome? might just be my particular user agent, it really does not like spinners