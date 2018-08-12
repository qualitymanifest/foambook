# change log:
- filter by date range
- fix query string validation early return
- add counts to cities
- update read_me.jsx


# todo:
- fix header highlighting for "active" buttons (broke on move to RRV4)
- remove all console.logs before re-uploading


# backburner improvements:
- better d3 tooltips (currently using html title attribute)
- query efficiency: when querying notes, only pull in dateTime field. if query is happening, other fields are already known since they are necessary to create a query

# notes:
- not currently putting query state in redux. no real good reason to - delete?
- why does header render three times when page is loaded? waiting for notes count?
- check to see if withTracker is being used correctly: https://atmospherejs.com/meteor/react-meteor-data