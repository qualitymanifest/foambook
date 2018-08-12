# change log:
- added query string validation


# todo:
- fix header highlighting for "active" buttons (broke on move to RRV4)
- allow filtering by date range 
- put a count on every city
- remove all console.logs before re-uploading


# backburner improvements:
- better d3 tooltips (currently using html title attribute)
- query efficiency: when querying notes, only pull in dateTime field. if query is happening, other fields are already known since they are necessary to create a query

# notes:
- not currently putting query state in redux. no real good reason to - delete?
- why does header render three times when page is loaded? waiting for notes count?
- check to see if withTracker is being used correctly: https://atmospherejs.com/meteor/react-meteor-data
- mongodb change streams: https://docs.mongodb.com/v3.6/changeStreams/#open-a-change-stream
- on submission page, allow users to click the submission and display the note? possibly by a redux action on notes_table, and have add_note_form hooked up to that, and if it receives something, show a scatterplot below?