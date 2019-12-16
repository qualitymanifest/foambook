import React from "react";
import FlagModal from "./flag_modal";
import { STATUS_APPROVED } from "../utils/constants";

const FlagTrash = ({ currentUser, dbUserId, docId, deleteHandler, type }) => {
  let renderElement = "";
  if (!currentUser) return renderElement;
  if (dbUserId === currentUser._id && currentUser.status === STATUS_APPROVED) {
    renderElement = (
      <button
        type="button"
        aria-label={`delete ${type}`}
        onClick={() => deleteHandler(docId)}
        className="glyphicon glyphicon-trash iconButton"
      />
    );
  } else if (currentUser.status === STATUS_APPROVED) {
    renderElement = <FlagModal problemId={docId} type={type} />;
  }
  return renderElement;
};

export default FlagTrash;
