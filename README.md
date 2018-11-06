# change log:
- Remove `moment` as a dependency - unneccesary since `moment-timezone` already contains it
- Update react-redux, moment-timezone, react-number-format, connected-react-router
- Significant changes in `main.jsx` and `reducers.js` due to breaking change in `connected-react-router`
- Add support for UP local symbols
- Add count/recency badges to states and railroads
- Consolidate query footnotes
- Use object-destructuring for `qString` in `query.jsx`


# bugs:

# todo:
- Create account permissions
- Create function that accepts an action parameter like "add comments" that will show appropriate message for user account permissions. `please log in to ${action}`, `this account is new and has not yet been approved to ${action}, please email administrator at ...`
- Allow for showing table of all queried notes, so they can be deleted or flagged more easily
	- Only dates/times need to be shown (along with flag/delete option), since all other fields are known due to query


# notes:
- withTracker usage: https://atmospherejs.com/meteor/react-meteor-data