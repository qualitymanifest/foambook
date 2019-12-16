import React from "react";
import moment from "moment-timezone";
import { decode } from "he";

import FlagTrash from "./flag_trash";
import { commentsDeleteMethod } from "../methods";
import { commentsSorter } from "../utils/queryFunctions";
import { TZ_DEFAULT } from "../utils/constants";

moment.tz.setDefault(TZ_DEFAULT);

const CommentsList = ({ comments, city, state, user }) => {
  if (!comments.length) return null;

  const sortedComments = commentsSorter(comments, city, state);

  const commentsBuilder = (commentSubset, isLocal) => {
    return commentSubset.map(commentDoc => {
      const { userName, userId, createdAt, comment, _id } = commentDoc;
      return (
        <div key={_id} className="box commentBox boxMargin boxPadding fadeIn">
          {!isLocal && (
            <strong>
              {commentDoc.city}, {commentDoc.state}
            </strong>
          )}
          <p>{decode(comment)}</p>
          <div className="commentData">
            <span>
              - {userName} {moment(createdAt).format("MM-DD-YYYY")}
            </span>
            <FlagTrash
              currentUser={user}
              dbUserId={userId}
              docId={_id}
              deleteHandler={commentsDeleteMethod}
              type="comment"
            />
          </div>
        </div>
      );
    });
  };

  return (
    <>
      {!!Object.keys(sortedComments.local).length && (
        <>
          <strong>
            Comments for this train in {city}, {state}:
          </strong>
          {commentsBuilder(sortedComments.local, true)}
        </>
      )}
      {!!Object.keys(sortedComments.other).length && (
        <>
          <strong>Comments for this train in other locations:</strong>
          {commentsBuilder(sortedComments.other, false)}
        </>
      )}
    </>
  );
};

export default CommentsList;
