import React from "react";

export default ReadMe = () => {
	return (
		<div>
			<p className="lead">A few notes on searching:</p>
			<ul>
				<li>You have to provide a railroad if you are going to search for a symbol. This may change.</li>
				<li>You can search for a railroad without any other search terms. This will change in the future.</li>
				<li>You can search for a location without any other search terms.</li>
				<li>You cannot execute a search with no search terms.</li>
			</ul>

			<p className="lead">A few notes on submitting:</p>
			<ul>
				<li>Date must be within the last five years.</li>
				<li>When entering a date/time, you don't have to add the dashes/spaces/semicolon, just type the numbers and they will be added for you</li>
				<li><strong>Enter times for whatever the time is where that train is</strong>. Usually, this will be your own time. However, if you are in New York and it's 1700 hours
				 and you are listening to railroadradio in Arizona where it's 1400 hours, please remember to use the Arizona time when you are submitting!</li>
				<li>Location must include a two-letter state and either a city, or a city and an additional location like a yard name or siding name. Examples:
					<ul>
						<li><span className="glyphicon glyphicon-thumbs-up" />TUCSON, AZ</li>
						<li><span className="glyphicon glyphicon-thumbs-up" />CHICAGO, BARR YARD, IL</li>
					</ul>
					<ul>
						<li><span className="glyphicon glyphicon-thumbs-down" />TUCSON</li>
						<li><span className="glyphicon glyphicon-thumbs-down" />AZ</li>
						<li><span className="glyphicon glyphicon-thumbs-down" />TUCSON, AZ, USA, EARTH</li>
					</ul>
				</li>
			</ul>
			<p className="lead">To delete notes or set your preferences:</p>
			<p>Sign in and click on your username (this will be whatever your name is on gmail). To delete a note click on the trash icon on the right
			side of the notes table. You can also set form defaults so that whenever you go to submit a train, you can already have the railroad and 
			location filled out, and time configured to the timezone you will be submitting for.</p>

			<p className="lead">This is very much a work in progress!</p>
			<p>If you experience any bugs, please let me know either by submitting an issue at <a href="https://github.com/qualitymanifest/foambook">the github repo </a>
			 or by sending an email to (the username of that github repo)@gmail.com. If you can pop open your browser console and take a screenshot of the error, even better. 
			 I would also be happy to hear feature requests but for the time being I am mostly going to focus on making things faster and more efficient.
			 A few features I do plan on implementing:</p>
			 <ul>
			 	<li>Option to specify time range of search results</li>
			 	<li>Hide the search terms you used from the search results (i.e. if you specified a railroad, don't show railroad in the results table, since you already know which railroad it is)</li>
			 	<li>Instead, show useful info like day of the week</li>
			 	<li>Attempt to "un-stack" search results on the scatterplot, and allow you to see their data by hovering your mouse over them</li>
			</ul>

		</div>
	);
};