import React from "react";

export default ReadMe = () => {
	return (
		<div id="readMe">
			<h3>What is this?</h3>
			<p>It's not uncommon for railfans to record train movements, but that data is scattered, and it can be hard to find any meaningful patterns by looking at a list of raw data.
			Foambook is intended to provide a centralized place to keep those notes, and to provide a way to quickly see when a train might be at a particular location.</p>
			<h3>To sign up:</h3>
			<p>You need a gmail account, as that is what is used for authentication. Signing up is simple: First, click the "Sign in with Google" button in the upper
			right corner. If you are on a mobile device, this button will be inside the hamburger menu <span className="glyphicon glyphicon-menu-hamburger smallIcon"></span>.
			A window will pop up, asking you to sign in to your google account, if you aren't already. Once you have done this, you have an account here. The process is the same to log in once you 
			have an account.</p>
			<h3>To delete notes or configure default form values:</h3>
			<p>First, go to your account page by clicking on your username in the upper right corner.</p>
			<p>To delete a note click on the trash icon on the right side of the notes table.</p>
			<p>You can also set form defaults so that whenever you go to submit a note, you automatically have the railroad and 
			location filled out, and the time filled out with the current time in the selected timezone.</p>
			<h3>When submitting notes:</h3>
			<ul id="readMeLis">
				<li>Date must be within the last five years.</li>
				<li>Times are entered using a 24-hour clock format. 2:30AM is 02:30, 2:30PM is 14:30, etc.</li>
				<li>Location must start with a city and end with a two-letter state. Optionally, you can include a third parameter (e.g. yard name or siding name) in between the city and state.</li>
					<li className="innerLi"><span className="glyphicon glyphicon-thumbs-up" />PORTLAND, OR</li>
					<li className="innerLi"><span className="glyphicon glyphicon-thumbs-up" />PORTLAND, LAKE YARD, OR</li>
					<li className="innerLi"><span className="glyphicon glyphicon-thumbs-down" />PORTLAND OR <em>(missing comma)</em></li>
					<li className="innerLi"><span className="glyphicon glyphicon-thumbs-down" />PORTLAND, OREGON <em>(use 2 letter state abbreviation)</em></li>
					<li className="innerLi"><span className="glyphicon glyphicon-thumbs-down" />PORTLAND, OR, LAKE YARD <em>(state must go last)</em></li>
				<li>
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
			it won't show up in the search options until the next time they are updated.</p>
			<p>Given that these notes are user-submitted, not official railroad data, the absence of notes from a particular day or time does not necessarily mean that that train
			does not operate then. That said, clear patterns are a positive inidicator that that train is typically at that location at that time.</p>
			<p>The best general source of symbol data I have found is at <a href="http://railroadfan.com/wiki/index.php/Main_Page">railroadfan.com/wiki</a> - it contains origins, destinations, 
			operating frequencies, and sometimes other information. It's not perfect, but it's usually accurate and it seems to be updated fairly regularly.</p>
			<h3>To include additional information about a train:</h3>
			<p>Search for the train you're looking for. When you find it, underneath the scatterplot there is section where you can add and delete comments. This is intended for general information about what 
			that train usually does at that location, e.g. "Arrives, sets out doublestacks up front, and ties down. Outbound crew on duty within two hours". Please be mindful about what you put here and do not 
			include any sensitive information, or you will be blocked from adding notes.</p>
			<h3>Feedback:</h3>
			<p>If you experience any bugs or have any input, please let me know either by submitting an issue at <a href="https://github.com/qualitymanifest/foambook">the github repo </a>
			 or by sending an email to qualityfiltering@gmail.com</p>
		</div>
	);
};