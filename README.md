# change log:
- Allow users to delete own notes on add_note_form

# bugs:

# todo:
- Create account permissions: APPROVED, UNAPPROVED, BANNED
- Create function that accepts an action parameter like "add comments" that will show appropriate message for user account permissions. `please log in to ${action}`, `this account is new and has not yet been approved to ${action}, please email administrator at ...`
- Allow for showing table of all queried notes, so they can be deleted or flagged more easily
- Make one table for aggregations, and only pull in necessary fields?
- For aggregations, create a "new" attribute set to "false" for each state. When a user submits a note, put it into the aggregations with "new" set to "true". When creating metadata, ignore "new: true" at first, then after organizing the "new: false" add the "new:true" ones if they do not exist. This will make query categories real time. Query categories can then be "cleaned up" by re-aggregating them... daily?

# notes:
- Check to see if withTracker is being used correctly: https://atmospherejs.com/meteor/react-meteor-data