import React, { Component } from "react";
import { Form } from "informed";
import { Panel } from "react-bootstrap";
import he from "he";

import { TextAreaWithError } from "./textarea_with_error";
import { commentSubmitMethod } from "../methods";
import { CommentsInsert } from "../collections/comments";
import { validComment } from "../validation";

const commentsPlaceholder = "Summarize what this train typically does here, or describe it's characteristics";
let apiHandle;

export default class CommentsForm extends Component {

	constructor(props) {
		super(props);
		this.toggleFunc = this.toggleFunc.bind(this);
		this.state = {
			open: false
		}
	}

	transferApi(formApi) {
		apiHandle = formApi;
	}

	onSubmit(formValues) {
		commentSubmitMethod(formValues, this.props.query, this.toggleFunc, apiHandle);
	}

	toggleFunc() {
		this.setState({open: !this.state.open});
	}
	
	render() {
		if (!this.props.user) {
			return <p id="commentLoggedOut">Log in to add comments</p>
		}
		return (
			<Panel id="commentPanel" expanded={this.state.open} onToggle={this.toggleFunc}>
				<Panel.Heading onClick={this.toggleFunc}>
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
							maxLength={300}
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