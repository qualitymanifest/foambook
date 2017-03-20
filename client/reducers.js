import { combineReducers } from "redux";
import { INCREMENT_PAGE_LOAD } from "./actions";

const INITIAL_PAGE_LOAD = { loadNum : 5 };

const pageLoadReducer = (state = INITIAL_PAGE_LOAD, action) => {
	switch (action.type) {
		case INCREMENT_PAGE_LOAD:
			return Object.assign({}, state, { loadNum : state.loadNum + 5 });
		default:
			return state;
	}
};

export default rootReducer = combineReducers({
	profileState : pageLoadReducer
});