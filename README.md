# change log:
- Remove `listSymbols` from `queryFunctions`, do all symbol rendering logic in `query_symbols`
- Add symbol sorting options
- Update @babel/runtime, @types/react, connected-react-router, eslint, informed, react, react-dom, react-number-format, react-redux


# bugs:

# todo:
- Create account permissions
- Create function that accepts an action parameter like "add comments" that will show appropriate message for user account permissions. `please log in to ${action}`, `this account is new and has not yet been approved to ${action}, please email administrator at ...`
- Allow for showing table of all queried notes, so they can be deleted or flagged more easily
	- Only dates/times need to be shown (along with flag/delete option), since all other fields are known due to query


# notes:
- withTracker usage: https://atmospherejs.com/meteor/react-meteor-data