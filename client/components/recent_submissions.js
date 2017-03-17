import React from 'react';

const RecentSubmissions = (props) => {
	const renderedSubmissions = props.recentSubmissions.map((train, idx) => {
		const {railroad, location, symbol, dateTime} = train
		return  (
			<ul key={idx}>
				<li>{railroad}</li>
				<li>{location}</li>
				<li>{symbol}</li>
				<li>{String(dateTime)}</li>
			</ul>
		)
	})
	return (
		<div>
			{renderedSubmissions}
		</div>
	)
}

export default RecentSubmissions;