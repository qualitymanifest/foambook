# change log:
- Add `info` collection consisting of scraped railroadfan data and aggregated multiple location data from foambook
- Add `info_display.jsx` to render info


# bugs:
- Comment dates are wrong timezone, can appear in separate day (see 12/10 note for q349 - made at 20:03)
- When opening several instances of the app, new notes are highlighted even if they were inserted before the instance started. Move newest note to redux?

# todo:
- Ability to change username
- Ability to download all of a user's notes (probably to xls file?)
- Allow for showing table of all queried notes, so they can be deleted or flagged more easily
	- Only dates/times need to be shown (along with flag/delete option), since all other fields are known due to query
- Button to update time field to current time on add_note_form
- Change the way date limiting is done from server query to client side filtering
	- Add min and max controls to filter date
	- Probably don't need to show date in URL anymore since not fetching from server?
- MAYBE: Change breadcrumbs to state / city / railroad / symbol. Make it so that state or railroad is expanded when url is navigated to


# notes:
- withTracker usage: https://atmospherejs.com/meteor/react-meteor-data
