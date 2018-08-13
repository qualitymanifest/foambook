# change log:
- add background grid to scatterplot, show 24 hours if not mobile

# todo:
- migrate to new versions of react, react-dom, react-form, react-number-format


# backburner improvements:
- better d3 tooltips (currently using html title attribute)
- query efficiency: when querying notes, only pull in dateTime field. if query is happening, other fields are already known since they are necessary to create a query

# notes:
- check to see if withTracker is being used correctly: https://atmospherejs.com/meteor/react-meteor-data
- loading spinner appears to stall the app occasionally when using chrome? might just be my particular user agent, it really does not like spinners