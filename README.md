# change log:
- Remove Underscore
- Tree-shake exports from Lodash
- Tree-shake He
- Split and tree-shake d3 packages
- Remove babel-polyfill^6.26.0, babel-runtime^6.26.0, prop-types^15.6.2
- Don't process dateTimeReadble until dot is hovered

# bugs:

# todo:
- Create account permissions
- Create function that accepts an action parameter like "add comments" that will show appropriate message for user account permissions. `please log in to ${action}`, `this account is new and has not yet been approved to ${action}, please email administrator at ...`
- Allow for showing table of all queried notes, so they can be deleted or flagged more easily
	- Only dates/times need to be shown (along with flag/delete option), since all other fields are known due to query


# notes:
- withTracker usage: https://atmospherejs.com/meteor/react-meteor-data