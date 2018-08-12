import React from "react";

export default ReadMe = () => {
	return (
		<div id="readMe">
			<p className="lead">A few tips on submitting notes:</p>
			<ul>
				<li>Date must be within the last five years.</li>
				<li>When entering a date/time, you don't have to add the dashes/spaces/semicolon, just type the numbers and they will be added for you.</li>
				<li><strong>Enter times for whatever the time is where that train is</strong>. Usually, this will be your own time. But, for example, if you are in New York and it's 1700 hours
				 and you are listening to railroadradio in Arizona where it's 1400 hours, please remember to use the Arizona time when you are submitting!</li>
				<li>Location must start with a city and end with a two-letter state. Optionally, you can include a third parameter (e.g. yard name or siding name) in between the city and state.
					<ul>
						<li><span className="glyphicon glyphicon-thumbs-up" />PORTLAND, OR</li>
						<li><span className="glyphicon glyphicon-thumbs-up" />PORTLAND, LAKE YARD, OR</li>
					</ul>
					<ul>
						<li><span className="glyphicon glyphicon-thumbs-down" />PORTLAND <em>(missing state)</em></li>
						<li><span className="glyphicon glyphicon-thumbs-down" />PORTLAND OR <em>(missing comma)</em></li>
						<li><span className="glyphicon glyphicon-thumbs-down" />PORTLAND, OREGON <em>(use 2 digit state abbreviation)</em></li>
						<li><span className="glyphicon glyphicon-thumbs-down" />PORTLAND, OR, LAKE YARD <em>(state must go last)</em></li>
					</ul>
				</li>
			</ul>
			<p className="lead">To delete notes or set your preferences:</p>
			<p>Sign in and then click on your username. To delete a note click on the trash icon on the right
			side of the notes table. You can also set form defaults so that whenever you go to submit a train, you automatically have the railroad and 
			location filled out, and time configured to the timezone you will be submitting for.</p>
			<p className="lead">When searching for notes:</p>
			<p>There is one quirk to be aware of. The search options table is separate from the table that holds all the notes. Notes are updated as soon
			as you add/delete them, but search options are updated hourly. This means that if you have submitted a note for a new location or a new symbol,
			it won't show up in the search options until the next time that table is updated. Rest assured though, if you see your note appear in the table
			underneath the submission form, it is in the database.</p>
			<p className="lead">To give feedback</p>
			<p>If you experience any bugs, or have any input, please let me know either by submitting an issue at <a href="https://github.com/qualitymanifest/foambook">the github repo </a>
			 or by sending an email to qualityfiltering@gmail.com.</p>

		</div>
	);
};