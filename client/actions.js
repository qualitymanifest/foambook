export const LOGIN = 'LOGIN';

export const login = (name) => {
	return {
		type : LOGIN,
		payload : name
	}
}