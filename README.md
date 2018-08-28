# change log:
- Remove reactive aggregations, revert to cronjob. Unfortunately (but not surprisingly) reactive aggregations performed poorly when tested with tens of thousands of notes.
- Split cronjob aggregations into two collections: aggregateLocations and aggregateSymbols. With tens of thousands of notes, using one collection meant sending quite a bit of data over the wire.
	- aggregateLocations (which is quite small) is sent by default
	- aggregateSymbols is only sent for one location, and only if city & state query parameters are passed in
- Update queryFunctions.js accordingly

# todo:


# backburner improvements:
- EITHER:
	- Add "events" field to submission form that pops open a multi-select with options like "CREW CHANGE, PICK UP, SET OUT, etc"
	- Figure out how to render events? probably no good way to do that in scatterplot, maybe something below the scatterplot that you can click to pop open that has DAY OF WEEK | DATETIME | EVENTS LIST
- OR:
	- Add comment-section style area underneath scatterplot, where each user can leave one (editable) message about what that train typically does there


# notes:
- Check to see if withTracker is being used correctly: https://atmospherejs.com/meteor/react-meteor-data
- Loading spinner appears to stall the app occasionally when using chrome? might just be my particular user agent, it really does not like spinners