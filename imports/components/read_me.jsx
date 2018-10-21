import React from "react";

export default ReadMe = () => {
	return (
		<div id="readMe" className="fadeIn">
			<h3>What is this?</h3>
			<p>It's not uncommon for railfans to record train movements, but that data is scattered, and it can be hard to find any meaningful patterns by looking at a list of raw data.
			Foambook is intended to provide a centralized place to keep those notes, and to provide a way to quickly see when a train might be at a particular location.</p>
			<h3>To sign up:</h3>
			<p>You need a gmail account, as that is what is used for authentication. Signing up is simple: First, click the "Sign in with Google" button in the upper
			right corner. If you are on a mobile device, this button will be inside the hamburger menu <span className="glyphicon glyphicon-menu-hamburger smallIcon"></span>.
			A window will pop up, asking you to sign in to your google account, if you aren't already. Once you have done this, you have an account here. The process is the same to log in once you 
			have an account.</p>
			<h3>To configure default form values:</h3>
			<p>Go to your account page by clicking on your username in the upper right corner. Fill out some or all of these fields and click "set defaults". This makes it so that whenever you go to submit a 
			note, you can automatically have the railroad and location filled out, and the time filled out with the current time in the selected timezone.</p>
			<h3>To delete notes:</h3>
			<p>From your account page or the note submission page, click the red trash icon <span className="glyphicon glyphicon-trash" /> on the right side of the notes table. You can only delete your own notes.</p>
			<h3>When submitting notes:</h3>
			<ul id="readMeLis">
				<li>Date must be within the last five years.</li>
				<li>Times are entered using a 24-hour clock format. 2:30AM is 02:30, 2:30PM is 14:30, etc.</li>
				<li>Location should be either a city or a timetable location. This field can be up to 30 characters long. All punctuation will be removed, only letters and spaces are kept.</li>
				<li>States/Provinces use two-letter abbrevation like AZ and BC.</li>
				<li>Currently supported railroads are BNSF, CN, CP, CSX, KCS, NS, PAR/PAS, and UP. This is because the train symbols have to be validated. 
				I am happy to add more - just send an email with the railroad name and symbol format to qualityfiltering@gmail.com</li>
				<li>In general, only road and local train symbols are supported. Miscellaneous things like yard jobs are not. Further, only the base symbols (and applicable section codes) 
				are supported. Additional info like date codes are not. For example, QRVWC and QRVWCB (second section of the QRVWC) are okay, but QRVWCB-24 is not.</li>
			</ul>
			<h3>When searching for notes:</h3>
			<p>There is one quirk to be aware of: The search options data is separate from the database collection that holds all the notes. Notes are updated as soon
			as you add/delete them, but search options are updated <strong>hourly</strong>. This means that if you have submitted a note for a new location or a new symbol,
			it won't show up in the search options until the next time they are updated. If you want to view the note or leave comments on it, you can click on the note in the table below
			the submission box to be taken to it.</p>
			<p>Given that these notes are user-submitted, not official railroad data, the absence of notes from a particular day or time does not necessarily mean that that train
			does not operate then. That said, clear patterns are a positive inidicator that that train is typically at that location at that time.</p>
			<p>The best general source of symbol data I have found is at <a href="http://railroadfan.com/wiki/index.php/Main_Page">railroadfan.com/wiki</a> - it contains origins, destinations, 
			operating frequencies, and sometimes other information. It's not perfect, but it's usually accurate and it seems to be updated fairly regularly.</p>
			<h3>To include additional information about a train:</h3>
			<p>Search for the train you're looking for. When you find it, underneath the scatterplot there is section where you can add and delete comments. This is intended for general information about what 
			that train usually does at that location, e.g. "Arrives, sets out doublestacks up front, and ties down. Outbound crew on duty within two hours". Please be mindful about what you put here and do not 
			include any sensitive information, or you will be blocked from adding notes.</p>
			<h3>If you find an incorrect/inappropriate note or comment:</h3>
			<p>Click the orange flag icon <span className="glyphicon glyphicon-flag" /> on the right hand side of the note/comment and a form will pop up. Please include a brief description of the problem. 
			Your comments here will not be publicly visible. The problem note/comment will then be reviewed and deleted if necessary.</p>
			<h3>Privacy:</h3>
			<p>When you create an account here, the only information that is collected is your google profile (email, name, profile picture, and language). This is essentially the same information that is included 
			when you send an email. Google also provides an ID and access token specific to this app to use for authentication - passwords are never involved.</p>
			<h3>Feedback:</h3>
			<p>If you experience any bugs or have any input, please let me know either by submitting an issue at <a href="https://github.com/qualitymanifest/foambook">the github repo </a>
			 or by sending an email to qualityfiltering@gmail.com</p>
			<p>If you have a large amount of notes already that you would like to upload, and they are in a standardized format (like a table or a list with consistent formatting), please let me know. I can
			 probably figure out a way to do a bulk upload directly to the database.</p>
		</div>
	);
};
