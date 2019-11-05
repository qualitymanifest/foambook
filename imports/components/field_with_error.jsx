import React from "react";
import { BasicText, asField } from "informed";

import { ERROR_NO_DESCRIPTION } from "../utils/constants";

export default asField(({ fieldState, ...props }) => (
	<>
		<BasicText
			fieldState={fieldState}
			{...props}
			style={fieldState.error ? { border: "solid 1px red" } : null}
		/>
		{fieldState.error && fieldState.error !== ERROR_NO_DESCRIPTION ? (
			<p className="form-error">{fieldState.error}</p>
		) : null}
	</>
));
