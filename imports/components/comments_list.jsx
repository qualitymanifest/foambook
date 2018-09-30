import React from "react";
import moment from "moment-timezone";
import he from "he";

import { CommentsDelete } from "../collections/comments";
import { commentsSorter } from "../queryFunctions";

moment.tz.setDefault("Etc/UTC");

export default CommentsList = (props) => {
	if (!props.commentsReady || !props.comments.length) return null;

	let sortedComments = commentsSorter(props.comments, props.city, props.state);

	this.deleteFunc = (commentId) => {
		CommentsDelete.call({ commentId }, (err) => {
			if (err) {
				alert(err);
			}
		});
	}

	const commentsBuilder = (comments, isLocal) => {
		return comments.map((com) => {
			const { userName, userId, createdAt, comment, city, state, _id } = com;
			return (
				<div key={_id} className="commentBox">
					{!isLocal && <strong>{city}, {state}</strong>}
					<p>{he.decode(comment)}</p>
					<div className="commentData">
					<span>- {userName} {moment(createdAt).format("MM-DD-YYYY")}</span>
					{ ( props.user && userId === props.user._id) ? 
							<span onClick={() => this.deleteFunc(_id)}
								className="glyphicon glyphicon-trash"
							/>
						: null
					}
					</div>
				</div>
			);
		})
	}
	
	return (
		<React.Fragment>
			{!!Object.keys(sortedComments.local).length && 
				<React.Fragment>
					<strong>Comments for this train in {props.city}, {props.state}:</strong>
					{commentsBuilder(sortedComments.local, true)}
				</React.Fragment>
			}
			{!!Object.keys(sortedComments.other).length &&
				<React.Fragment>
					<strong>Comments for this train in other locations:</strong>
					{commentsBuilder(sortedComments.other, false)}
				</React.Fragment>
			}
		</React.Fragment>
	);
};