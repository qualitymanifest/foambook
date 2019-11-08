import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "informed";
import { debounce } from "lodash";

import TextAreaWithError from "./textarea_with_error";
import { flagSubmitMethod } from "../methods";


export default FlagModal = ({ _id, type, validationFunc }) => {
	const [visible, setVisible] = useState(false);
	const [success, setSuccess] = useState(false);

	const onSubmit = ({ reason }) => flagSubmitMethod(
		{ reason, problemId: _id, flagType: type },
		setVisible,
		setSuccess
	);

	const FlagSpan = <span onClick={() => setVisible(true)} className="glyphicon glyphicon-flag" />;

	return (
		<>
			{type === "note" ?
				<td>{FlagSpan}</td> :
				{ FlagSpan }
			}
			<Modal show={visible} onHide={() => setVisible(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Flag {type} for review</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{success ?
						<strong>Flag submitted successfully, thank you for your input</strong> :
						(
							<Form
								onSubmit={debounce(onSubmit, 200)}
							>
								<TextAreaWithError
									className="form-control"
									maxLength={100}
									field="reason"
									placeholder={`Please explain the issue with this ${type}`}
									validateOnBlur
									validate={validationFunc}
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
