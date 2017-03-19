import React from 'react';
import { createContainer } from 'meteor/react-meteor-data'

import Header from './header';

export default (props) => {
	return (
		<div>
			<Header />
			{props.children}		
		</div>
	)
}