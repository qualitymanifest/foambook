export const INCREMENT_PAGE_LOAD = "INCREMENT_PAGE_LOAD";

export const incrementPages = () => {
	return {
		type: INCREMENT_PAGE_LOAD
	};
};

export const CHANGE_QUERY = "CHANGE_QUERY";

export const changeQuery = (values) => {
	console.log(values)
	return {
		type: CHANGE_QUERY,
		payload: values
	};
};

export const SCREEN_RESIZE = "SCREEN_RESIZE";

export const screenResize = (width) => {
	return {
		type: SCREEN_RESIZE,
		screenWidth: width
	}
}