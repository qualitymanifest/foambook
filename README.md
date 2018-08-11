# change log:
- added unique keys to every div produced by an iterator in queryFunctions
- fetching notes in queryDisplay


# todo:
- redux on querydisplay for uistate (and maybe query state?)
- style query page
- fix header highlighting for "active" buttons (broke on move to RRV4)
- allow filtering by date range 
- query efficiency: when querying notes, only pull in dateTime field. if query is happening, other fields are already known since they are necessary to create a query


# backburner improvements:
- better d3 tooltips (currently using html title attribute)