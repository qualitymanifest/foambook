import React from "react";
import { DateTime } from "luxon";
import { decode } from "he";

import FlagTrash from "./flag_trash";
import { commentsDeleteMethod } from "../methods";
import { commentsSorter } from "../utils/queryFunctions";
import { ZONES, DATETIME_FORMAT_SHORT } from "../utils/constants";

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
              - {userName}{" "}
              {DateTime.fromMillis(createdAt)
                .setZone(ZONES.EST)
                .toFormat(DATETIME_FORMAT_SHORT)}
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
