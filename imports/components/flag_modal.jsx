import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Form, RadioGroup, Radio } from "informed";

import { TextAreaWithError } from "./textarea_with_error";
import { flagSubmitMethod } from "../methods";


class FlagModal extends Component {
	constructor(props) {
		super(props);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSuccess = this.handleSuccess.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			show: false,
			success: false
		};
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	handleSuccess() {
		this.setState({success: true});
	}

	onSubmit(value) {
		flagSubmitMethod({reason: value.reason, problemId: this.props._id, flagType: this.props.type}, this.handleClose, this.handleSuccess);
	}

	render() {
		return (
			<React.Fragment>
				{this.props.type === "note" ?
				<td><span onClick={this.handleShow} className="glyphicon glyphicon-flag" /></td> :
				<span onClick={this.handleShow} className="glyphicon glyphicon-flag" />
				}
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Flag {this.props.type} for review</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{ this.state.success ? 
							<strong>Flag submitted successfully, thank you for your input</strong> :
							<Form 
								getApi={this.transferApi}
								onSubmit={_.debounce(this.onSubmit.bind(this), 200) /*slow it down in case button gets clicked twice*/} >
								<TextAreaWithError 
									className="form-control"
									maxLength={100}
									field="reason" 
									placeholder={`Please explain the issue with this ${this.props.type}`}
									validateOnBlur
									validate={this.props.validationFunc} />
								<button className="btn btn-primary">
									<span className="glyphicon glyphicon-pencil" />
									Submit
								</button>
							</Form>
						}
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}
}

export default FlagModal;