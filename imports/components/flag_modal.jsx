import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "informed";
import { debounce } from "lodash";

import TextAreaWithError from "./textarea_with_error";
import { flagSubmitMethod } from "../methods";
import { validFlag } from "../utils/validation";
import { FORM_DEBOUNCE_MS } from "../utils/constants";


export default FlagModal = ({ problemId, flagType }) => {
	const [visible, setVisible] = useState(false);
	const [success, setSuccess] = useState(false);

	const onSubmit = ({ reason }) => flagSubmitMethod(
		{ reason, problemId, flagType },
		setVisible,
		setSuccess
	);

	return (
		<>
			{flagType === "note" ?
				<td><span onClick={() => setVisible(true)} className="glyphicon glyphicon-flag" /></td> :
				<span onClick={() => setVisible(true)} className="glyphicon glyphicon-flag" />
			}
			<Modal show={visible} onHide={() => setVisible(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Flag {flagType} for review</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{success ?
						<strong>Flag submitted successfully, thank you for your input</strong> :
						(
							<Form
								onSubmit={debounce(onSubmit, FORM_DEBOUNCE_MS)}
							>
								<TextAreaWithError
									className="form-control"
									maxLength={100}
									field="reason"
									placeholder={`Please explain the issue with this ${flagType}`}
									validateOnBlur
									validate={validFlag}
								/>
								<button type="submit" className="btn btn-primary">Submit</button>
							</Form>
						)
					}
				</Modal.Body>
			</Modal>
		</>
	);
};
