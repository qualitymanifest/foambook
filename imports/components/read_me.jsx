import React from "react";

export default ReadMe = () => {
	return (
		<div id="readMe">
			<h3>To sign up:</h3>
			<p>You must have a gmail account, as that is what is used for authentication. Signing up is simple: First, click the "Sign in with Google" button in the upper
			right corner. If you are on a mobile device, this button will be inside the hamburger menu (<span className="glyphicon glyphicon-menu-hamburger smallIcon"></span>).
			A window will pop up, asking you to sign in to your google account. Once you have done this, you have an account here. The process is the same to log in once you 
			have an account.</p>
			<h3>To delete notes or set your preferences:</h3>
			<p>Log in if you aren't already, and then click on your username in the upper right corner. To delete a note click on the trash icon on the right
			side of the notes table. You can also set form defaults so that whenever you go to submit a note, you automatically have the railroad and 
			location filled out, and time configured to the timezone you will be submitting for.</p>
			<h3>When submitting notes:</h3>
			<ul>
				<li>Date must be within the last five years.</li>
				<li>When entering a date/time, you don't have to add the dashes/spaces/semicolon, just type the numbers and they will be added for you.</li>
				<li>Times are entered using a 24-hour clock format. 2:30AM is 02:30, 2:30PM is 14:30, etc.</li>
				<li><strong>Enter times for whatever the time is where that train is</strong>. Usually, this will be your own time. But, for example, if you are in New York and it's 17:00
				 and you are listening to railroadradio in Arizona where it's 14:00, please remember to use the Arizona time when you are submitting!</li>
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
					Please check to see if the location you are submitting for already exists, and follow that format. This is to prevent duplicate entries like
					"PORTLAND, <strong>LAKE YARD</strong>, OR" and "PORTLAND, <strong>LAKE YD</strong>, OR" that have to be manually merged.
				</li>
				<li>Currently supported railroads are BNSF, CN, CP, CSX, KCS, NS, PAR/PAS, and UP. This is because the train symbols have to be validated. 
				I am happy to add more - just send an email with the railroad name and symbol format to qualityfiltering@gmail.com</li>
				<li>In general, only road and local train symbols are supported. Miscellaneous things like yard jobs are not. Further, only the base symbols (and applicable section codes) 
				are supported. Additional info like date codes are not. For example, QRVWC and QRVWCB (second section of the QRVWC) are okay, but QRVWCB-24 is not.</li>
			</ul>
			<h3>When searching for notes:</h3>
			<p>There is one quirk to be aware of: The search options data is separate from the database collection that holds all the notes. Notes are updated as soon
			as you add/delete them, but search options are updated <strong>every 15 minutes</strong>. This means that if you have submitted a note for a new location or a new symbol,
			it won't show up in the search options until the next time they are updated. Rest assured though, if you see your note appear in the table
			underneath the submission form, it is in the database.</p>
			<p>Given that these notes are user-submitted, not official RR data, the absence of notes from a particular day or time does not necessarily mean that that train
			does not operate then. That said, clear patterns are a positive inidicator that that train is typically at that location at that time.</p>
			<p>The best general source of symbol data I have found is at <a href="http://railroadfan.com/wiki/index.php/Main_Page">railroadfan.com/wiki</a> - it contains origins, destinations, 
			operating frequencies, and sometimes other information. It's not perfect, but it's usually accurate and it seems to be updated fairly regularly.</p>
			<h3>Feedback:</h3>
			<p>If you experience any bugs, or have any input, please let me know either by submitting an issue at <a href="https://github.com/qualitymanifest/foambook">the github repo </a>
			 or by sending an email to qualityfiltering@gmail.com</p>

		</div>
	);
};