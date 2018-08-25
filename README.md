# change log:
- Migrate to react 16.4.1, react-dom 16.4.1, react-number-format 3.5.1
- Migrate to informed from react-form
	- Completely rewrote submit and preference forms
	- Rewrote form validation functions (informed does not allow form-level validation, only field-level)

# todo:
- sort notes coming into query_display at publication level so that newest and oldest doesn't have to be calculated

# backburner improvements:
- add "events" field to submission form that pops open a multi-select with options like "CREW CHANGE, PICK UP, SET OUT, etc"
- figure out how to render events? probably no good way to do that in scatterplot, maybe something below the scatterplot that you can click to pop open that has DAY OF WEEK | DATETIME | EVENTS LIST
	- if this is done, should sort notes by date when they come in. this would:
		A. make it so events can be shown in descending chronological order
		B. make it so newest and oldest note no longer needs to be computed in processNotes function


# notes:
- check to see if withTracker is being used correctly: https://atmospherejs.com/meteor/react-meteor-data
- loading spinner appears to stall the app occasionally when using chrome? might just be my particular user agent, it really does not like spinners