# change log:
- added new query page with list of locations / symbols
- added breadcrumb trail to query page
- added queryFunctions.js to provide helper functions for query.jsx


# todo:
- add unique keys to generated Links in query.jsx
- put queryStrings in redux so that component will rerender
- style query page
- fix header highlighting for "active" buttons (broke on move to RRV4)
- allow filtering by date range 
- query efficiency: when querying notes, only pull in dateTime field. if query is happening, other fields are already known since they are necessary to create a query


# backburner improvements:
- better d3 tooltips (currently using html title attribute)