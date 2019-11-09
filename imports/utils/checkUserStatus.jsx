import React from "react";
import { Link } from "react-router-dom";

import { STATUS_APPROVED } from "./constants";

export default (user, route) => {
	const userStatus = {
		shouldRender: false,
		renderInstead: <p>There was an error retrieving your account status</p>
	};

	if (!user) {
		if (route === "comments_form") {
			userStatus.renderInstead = <p id="commentLoggedOut">Log in to add comments</p>;
		}
		else {
			const message = route === "add_note_form" ? "add notes" : "view your profile";
			userStatus.renderInstead = (
				<div className="text-center logMessage">
					Log in to {message}. For more information, visit the
					<Link to="/read_me"> readme</Link>.
				</div>
			);
		}
	}

	else if (user === "LOADING") {
		userStatus.renderInstead = <div className="spinner" />;
	}

	else if (user.status === STATUS_APPROVED) {
		userStatus.shouldRender = true;
	}

	else if (user.status === "PENDING") {
		const returnMessage = `Your account has not yet been approved. Please check your email (including spam folder)
			and answer the verification email.`;
		if (route === "comments_form") {
			userStatus.renderInstead = <p id="commentLoggedOut">{returnMessage}</p>;
		}
		else {
			userStatus.renderInstead = (
				<div className="text-center logMessage">
					{returnMessage}
				</div>
			)
		}
	}

	else if (user.status === "BLOCKED") {
		const returnMessage = "Your account has been blocked for spam or inappropriate content.";
		if (route === "comments_form") {
			userStatus.renderInstead = <p id="commentLoggedOut">{returnMessage}</p>;
		}
		else {
			userStatus.renderInstead = <div className="text-center logMessage">{returnMessage}</div>;
		}
	}

	return userStatus;
}
