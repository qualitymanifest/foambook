import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import { INCREMENT_PAGE_LOAD } from "./actions";

const INITIAL_PAGE_LOAD = { loadNum: 5 };

const pageLoadReducer = (state = INITIAL_PAGE_LOAD, action) => {
	switch (action.type) {
		case INCREMENT_PAGE_LOAD:
			return Object.assign({}, state, { loadNum: state.loadNum + 10 });
		default:
			return state;
	}
};

export default history => combineReducers({
	router: connectRouter(history),
	profileState: pageLoadReducer
});
