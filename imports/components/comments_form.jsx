import React, { useState } from "react";
import { Form } from "informed";
import { Panel } from "react-bootstrap";
import { debounce } from "lodash";

import TextAreaWithError from "./textarea_with_error";
import { commentSubmitMethod } from "../methods";
import { validComment } from "../utils/validation";
import checkUserStatus from "../utils/checkUserStatus";
import { FORM_DEBOUNCE_MS } from "../utils/constants";

const commentsPlaceholder = "Summarize what this train typically does here, or describe it's characteristics";
let apiHandle;

export default CommentsForm = ({ query, user }) => {

	const checkUser = checkUserStatus(user, "comments_form");
	if (!checkUser.shouldRender) {
		return checkUser.renderInstead;
	}

	const [isExpanded, setExpanded] = useState(false);

	const transferApi = (formApi) => {
		apiHandle = formApi;
	}

	const onSubmit = (formValues) => commentSubmitMethod(formValues, query, setExpanded, apiHandle);

	return (
		<Panel
			id="commentPanel"
			className="boxMargin"
			expanded={isExpanded}
			onToggle={() => setExpanded(!isExpanded)}
		>
			<Panel.Heading onClick={() => setExpanded(!isExpanded)}>
				<Panel.Title>
					Add comment
				</Panel.Title>
			</Panel.Heading>
			<Panel.Body collapsible>
				<Form
					id="commentsFormGroup"
					getApi={transferApi}
					onSubmit={debounce(onSubmit, FORM_DEBOUNCE_MS)}
				>
					<TextAreaWithError
						className="form-control"
						maxLength={300}
						field="comment"
						placeholder={commentsPlaceholder}
						validateOnBlur
						validate={validComment}
					/>
					<button type="submit" className="btn btn-primary">Submit</button>
				</Form>
			</Panel.Body>
		</Panel>
	);
}
