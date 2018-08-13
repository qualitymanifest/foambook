import { combineReducers } from "redux";
import { INCREMENT_PAGE_LOAD, SCREEN_RESIZE, CHANGE_PATH } from "./actions";

const INITIAL_PAGE_LOAD = { loadNum: 5 };

const pageLoadReducer = (state = INITIAL_PAGE_LOAD, action) => {
	switch (action.type) {
		case INCREMENT_PAGE_LOAD:
			return Object.assign({}, state, { loadNum: state.loadNum + 5 });
		default:
			return state;
	}
};

const pathReducer = (state = {path : ""}, action) => {
	switch (action.type) {
		case CHANGE_PATH:
			return Object.assign({}, action.payload);
		default:
			return state;
	}
};

const INITIAL_UI = {
	screenWidth: typeof window === "object" ? window.innerWidth : null
};

const uiReducer = (state = INITIAL_UI, action) => {
	switch (action.type) {
		case SCREEN_RESIZE:
			return Object.assign({}, state, {
				screenWidth: action.screenWidth
			});
		default:
			return state;
	}
};

export default rootReducer = combineReducers({
	profileState: pageLoadReducer,
	uiState: uiReducer,
	pathState: pathReducer
});
