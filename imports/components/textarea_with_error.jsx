import React from "react";
import { TextArea, asField } from "informed";

export default asField(({ fieldState, maxLength, ...props }) => (
	<>
		<TextArea
			fieldState={fieldState}
			{...props}
			style={fieldState.error ? { border: "solid 1px red" } : null}
		/>
		{fieldState.error && fieldState.error !== "error-no-description" ? (
			<p className="form-error">{fieldState.error}</p>
		) : null}
		<small>
			{`${fieldState.value ? fieldState.value.length : 0}/${maxLength} characters used`}
		</small>
	</>
));
