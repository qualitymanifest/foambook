import React, { Component } from "react";
import { Form, TextArea, asField } from "informed";
import { Panel } from "react-bootstrap";
import he from "he";

import { CommentsInsert } from "../collections/comments";
import { validComment } from "../validation";

const commentsPlaceholder = "Summarize what this train typically does here, or describe it's characteristics";

let apiHandle;

const TextAreaWithError = asField(({ fieldState, ...props }) => (
  <React.Fragment>
    <TextArea
      fieldState={fieldState}
      {...props}
      style={fieldState.error ? { border: 'solid 1px red' } : null}
    />
    {fieldState.error && fieldState.error !== "error-no-description" ? (
      <p className="form-error">{fieldState.error}</p>
    ) : null}
    <small>{fieldState.value ? fieldState.value.length : 0}/300 characters used</small>
  </React.Fragment>
));

export default class CommentsForm extends Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false
		}
	}

	transferApi(formApi) {
		apiHandle = formApi;
	}

	onSubmit(formValues) {
		let cleansedComment = he.encode(formValues.comment);
		let comment = {
			comment: cleansedComment,
			city: this.props.query.city,
			state: this.props.query.state,
			railroad: this.props.query.railroad,
			symbol: this.props.query.symbol
		};
		CommentsInsert.call(comment, (err) => {
			if (err) {
				alert(err);
			}
			else {
				this.setState({ open: !this.state.open });
				apiHandle.setValue("comment", "");
			}
		});
	}
	
	render() {
		if (!this.props.user) {
			return <p id="commentLoggedOut">Log in to add comments</p>
		}
		return (
			<Panel id="commentPanel" expanded={this.state.open} onToggle={() => null}>
				<Panel.Heading onClick={() => this.setState({ open: !this.state.open })}>
					<Panel.Title>
						Add comment
					</Panel.Title>
				</Panel.Heading>
				<Panel.Body collapsible>
					<Form 
						id="commentsFormGroup"
						getApi={this.transferApi}
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
}