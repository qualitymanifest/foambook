import React from "react";
import { asField } from "informed";
import NumberFormat from "react-number-format";

import { ERROR_NO_DESCRIPTION } from "../utils/validation";

export default asField(({ fieldState, fieldApi, ...props }) => {
	const { getValue, setValue, setTouched } = fieldApi;
	const { onChange, onBlur, initialValue, forwardedRef, ...rest } = props;
	return (
		<>
			<NumberFormat
				{...rest}
				format="##-##-## ##:##"
				value={getValue()}
				onChange={e => setValue(e.target.value)}
				onBlur={() => setTouched()}
				style={fieldState.error ? { border: "solid 1px red" } : null}
			/>
			{fieldState.error && fieldState.error !== ERROR_NO_DESCRIPTION ? (
				<p className="form-error">{fieldState.error}</p>
			) : null}
		</>
	);
});
