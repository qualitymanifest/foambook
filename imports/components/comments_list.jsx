import React from "react";
import moment from "moment-timezone";
import { decode } from "he";

import FlagModal from "./flag_modal";
import { commentsDeleteMethod } from "../methods";
import { commentsSorter } from "../utils/queryFunctions";
import { STATUS_APPROVED, TZ_DEFAULT } from "../utils/constants";

moment.tz.setDefault(TZ_DEFAULT);

export default CommentsList = ({ comments, city, state, user }) => {
	if (!comments.length) return null;

	let sortedComments = commentsSorter(comments, city, state);

	const commentsBuilder = (comments, isLocal) => {
		return comments.map((commentDoc) => {
			const { userName, userId, createdAt, comment, city, state, _id } = commentDoc;
			return (
				<div key={_id} className="box commentBox boxMargin boxPadding fadeIn">
					{!isLocal && <strong>{city}, {state}</strong>}
					<p>{decode(comment)}</p>
					<div className="commentData">
						<span>- {userName} {moment(createdAt).format("MM-DD-YYYY")}</span>
						{(user && userId === user._id && user.status === STATUS_APPROVED) ?
							<span onClick={() => commentsDeleteMethod(_id)}
								className="glyphicon glyphicon-trash"
							/>
							: user && user.status === STATUS_APPROVED ?
								<FlagModal problemId={_id} flagType="comment" />
								: ""
						}
					</div>
				</div>
			);
		});
	};

	return (
		<>
			{!!Object.keys(sortedComments.local).length &&
				<>
					<strong>Comments for this train in {city}, {state}:</strong>
					{commentsBuilder(sortedComments.local, true)}
				</>
			}
			{!!Object.keys(sortedComments.other).length &&
				<>
					<strong>Comments for this train in other locations:</strong>
					{commentsBuilder(sortedComments.other, false)}
				</>
			}
		</>
	);
};
