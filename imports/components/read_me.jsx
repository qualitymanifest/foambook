import React from "react";

export default ReadMe = () => {
	return (
		<div>
			<p className="lead">A few tips on submitting notes:</p>
			<ul>
				<li>Date must be within the last five years.</li>
				<li>When entering a date/time, you don't have to add the dashes/spaces/semicolon, just type the numbers and they will be added for you.</li>
				<li><strong>Enter times for whatever the time is where that train is</strong>. Usually, this will be your own time. However, if you are in New York and it's 1700 hours
				 and you are listening to railroadradio in Arizona where it's 1400 hours, please remember to use the Arizona time when you are submitting!</li>
				<li>Location must start with a city and end with a two-letter state. Optionally, you can include a third parameter (e.g. yard name or siding name) in between the city and state.
					<ul>
						<li><span className="glyphicon glyphicon-thumbs-up" />PORTLAND, OR</li>
						<li><span className="glyphicon glyphicon-thumbs-up" />PORTLAND, LAKE YARD, OR</li>
					</ul>
					<ul>
						<li><span className="glyphicon glyphicon-thumbs-down" />PORTLAND <em>(missing state)</em></li>
						<li><span className="glyphicon glyphicon-thumbs-down" />OR <em>(missing city)</em></li>
						<li><span className="glyphicon glyphicon-thumbs-down" />PORTLAND OR <em>(missing comma)</em></li>
						<li><span className="glyphicon glyphicon-thumbs-down" />PORTLAND, OREGON <em>(use 2 digit state abbreviation)</em></li>
						<li><span className="glyphicon glyphicon-thumbs-down" />PORTLAND, OR, LAKE YARD <em>(state must go last)</em></li>
					</ul>
				</li>
			</ul>
			<p className="lead">To delete notes or set your preferences:</p>
			<p>Sign in and click on your username (this will be whatever your name is on gmail). To delete a note click on the trash icon on the right
			side of the notes table. You can also set form defaults so that whenever you go to submit a train, you can already have the railroad and 
			location filled out, and time configured to the timezone you will be submitting for.</p>

			<p className="lead">This is very much a work in progress!</p>
			<p>If you experience any bugs, please let me know either by submitting an issue at <a href="https://github.com/qualitymanifest/foambook">the github repo </a>
			 or by sending an email to qualityfiltering@gmail.com. If you can pop open your browser console and take a screenshot of the error, even better. 
			 I would also be happy to hear feature requests but for the time being I am mostly going to focus on making things more efficient.
			 A few changes I do plan on making:</p>
			 <ul>
			 	<li>Option to specify time range of search results</li>
			 	<li>Improve the query page by changing it from a form to a list of all locations, that when clicked, show all symbols within a location</li>
			 	<li>Attempt to "un-stack" search results on the scatterplot, and allow you to see their data by hovering your mouse over them</li>
			</ul>

		</div>
	);
};