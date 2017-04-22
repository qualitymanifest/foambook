import { combineReducers } from "redux";
import { INCREMENT_PAGE_LOAD, CHANGE_QUERY } from "./actions";

const INITIAL_PAGE_LOAD = { loadNum: 5 };

const pageLoadReducer = (state = INITIAL_PAGE_LOAD, action) => {
	switch (action.type) {
		case INCREMENT_PAGE_LOAD:
			return Object.assign({}, state, { loadNum: state.loadNum + 5 });
		default:
			return state;
	}
};


const INITIAL_QUERY = { railroad: "UP", symbol: "QEWWC" };

const queryReducer = (state = INITIAL_QUERY, action) => {
	switch (action.type) {
		case CHANGE_QUERY:
			return Object.assign({}, action.payload)
		default:
			return state;
	}
};

export default rootReducer = combineReducers({
	profileState: pageLoadReducer,
	queryState: queryReducer
});
