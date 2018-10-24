import React from "react";
import moment from "moment-timezone";
import { decode } from "he";

import FlagModal from "./flag_modal";
import { validFlag } from "../validation";
import { commentsDeleteMethod } from "../methods";
import { commentsSorter } from "../queryFunctions";

moment.tz.setDefault("Etc/UTC");

export default CommentsList = (props) => {
	if (!props.commentsReady || !props.comments.length) return null;

	let sortedComments = commentsSorter(props.comments, props.city, props.state);

	const commentsBuilder = (comments, isLocal) => {
		return comments.map((commentDoc) => {
			const { userName, userId, createdAt, comment, city, state, _id } = commentDoc;
			return (
				<div key={_id} className="commentBox">
					{!isLocal && <strong>{city}, {state}</strong>}
					<p>{decode(comment)}</p>
					<div className="commentData">
						<span>- {userName} {moment(createdAt).format("MM-DD-YYYY")}</span>
						{ (props.user && userId === props.user._id) ? 
								<span onClick={() => commentsDeleteMethod(_id)}
									className="glyphicon glyphicon-trash"
								/>
							: props.user ?
							<FlagModal _id={_id} type="comment" validationFunc={validFlag} />
							: ""
						}
					</div>
				</div>
			);
		});
	};

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
