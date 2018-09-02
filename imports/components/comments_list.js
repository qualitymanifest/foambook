import React from "react";
import moment from "moment-timezone";
import he from "he";

import { CommentsDelete } from "../collections/comments";

moment.tz.setDefault("Etc/UTC");

export default CommentsList = (props) => {
	if (!props.comments.length) return null;

	this.deleteFunc = (commentId) => {
		CommentsDelete.call({ commentId }, (err) => {
			if (err) {
				alert(err);
			}
		});
	}

	const renderedComments = props.comments.map((com) => {
		const { userName, userId, createdAt, comment, _id } = com;
		return (
			<div key={_id} className="commentBox">
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
	});
	return (
		<React.Fragment>
			{renderedComments}
		</React.Fragment>
	);
};