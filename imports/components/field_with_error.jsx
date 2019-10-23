import React from "react";
import { BasicText, asField } from "informed";

export default asField(({ fieldState, ...props }) => (
	<>
		<BasicText
			fieldState={fieldState}
			{...props}
			style={fieldState.error ? { border: "solid 1px red" } : null}
		/>
		{fieldState.error && fieldState.error !== "error-no-description" ? (
			<p className="form-error">{fieldState.error}</p>
		) : null}
	</>
));
