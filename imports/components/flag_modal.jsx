import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "informed";
import { debounce } from "lodash";

import TextAreaWithError from "./textarea_with_error";
import { flagSubmitMethod } from "../methods";
import { validFlag } from "../utils/validation";
import { FORM_DEBOUNCE_MS } from "../utils/constants";

const FlagModal = ({ problemId, type }) => {
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = ({ reason }) =>
    flagSubmitMethod({ reason, problemId, type }, setVisible, setSuccess);

  return (
    <>
      <button
        type="button"
        aria-label={`delete ${type}`}
        onClick={() => setVisible(true)}
        className="glyphicon glyphicon-flag iconButton"
      />
      <Modal show={visible} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Flag {type} for review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success ? (
            <strong>
              Flag submitted successfully, thank you for your input
            </strong>
          ) : (
            <Form onSubmit={debounce(onSubmit, FORM_DEBOUNCE_MS)}>
              <TextAreaWithError
                className="form-control"
                maxLength={100}
                field="reason"
                placeholder={`Please explain the issue with this ${type}`}
                validateOnBlur
                validate={validFlag}
              />
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FlagModal;
