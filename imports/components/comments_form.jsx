import React, { Component } from "react";
import { Form, TextArea, asField } from "informed";
import { Panel } from "react-bootstrap";
import he from "he";

import { CommentsInsert } from "../collections/comments";
import { validComment } from "../validation";

const commentsPlaceholder = "Summarize what this train typically does at this location";

const TextAreaWithError = asField(({ fieldState, ...props }) => (
  <React.Fragment>
    <TextArea
      fieldState={fieldState}
      {...props}
      style={fieldState.error ? { border: 'solid 1px red' } : null}
    />
    {fieldState.error && fieldState.error !== "empty" ? (
      <p className="form-error">{fieldState.error}</p>
    ) : null}
    <small>{fieldState.value ? fieldState.value.length : 0}/300 characters used</small>
  </React.Fragment>
));

export default CommentsForm = (props) => {
	if (!props.user) {
		return <p id="commentLoggedOut">Log in to add comments</p>
	}
	this.onSubmit = (formValues) => {
		let cleansedComment = he.encode(formValues.comment);
		let comment = {
			comment: cleansedComment,
			city: props.query.city,
			state: props.query.state,
			railroad: props.query.railroad,
			symbol: props.query.symbol
		};
		CommentsInsert.call(comment, (err) => {
			if (err) {
				alert(err);
			}
		});
	}
	return (
		<Panel id="commentPanel">
			<Panel.Heading>
				<Panel.Toggle>
					<Panel.Title>
						Add comment
					</Panel.Title>
				</Panel.Toggle>
			</Panel.Heading>
			<Panel.Body collapsible>
				<Form 
					id="commentsFormGroup"
					onSubmit={_.debounce(this.onSubmit.bind(this), 200) /*slow it down in case button gets clicked twice*/} >
					  <TextAreaWithError 
					  	className="form-control" 
					  	field="comment" 
					  	placeholder={commentsPlaceholder}
					  	validateOnBlur
					  	validate={validComment} />
						<button className="btn btn-primary">
							<span className="glyphicon glyphicon-pencil" />
							Submit
						</button>
				</Form>
			</Panel.Body>
		</Panel>
	)
}