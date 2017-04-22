import React from "react";
import Scatterplot from "./scatterplot";
import NotesTable from "./notes_table";

const QueryDisplay = (props) => {
	if (props.loading) {
		return <div id="spinner" />;
	}
	if (!props.notes.length) {
		return <div>There were no matches to that query</div>
	}
	return (
		<div>
			<Scatterplot notes={props.notes} uiState={props.uiState} />
			<NotesTable notes={props.notes} />
		</div>
	);
};

export default QueryDisplay;