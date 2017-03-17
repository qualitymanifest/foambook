import { combineReducers } from 'redux';
import { LOGIN, LOGOUT } from './actions';

const INITIAL_USER_STATE = { name : null }
const userReducer = (state = INITIAL_USER_STATE, action) => {
	switch (action.type) {
		case LOGIN:
			return Object.assign({}, state, { name : action.name })
		case LOGOUT:
			return Object.assign({}, state, { name : null })
		default:
			return state
	}
}

const rootReducer = combineReducers({
	user : userReducer
})

export default rootReducer