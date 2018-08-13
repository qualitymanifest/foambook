# change log:
- fix header highlighting by storing location in redux and using that to choose to apply active className

# todo:
- migrate to new versions of react, react-dom, react-form, react-number-format


# backburner improvements:
- better d3 tooltips (currently using html title attribute)
- query efficiency: when querying notes, only pull in dateTime field. if query is happening, other fields are already known since they are necessary to create a query

# notes:
- check to see if withTracker is being used correctly: https://atmospherejs.com/meteor/react-meteor-data
- loading spinner appears to stall the app occasionally when using chrome?