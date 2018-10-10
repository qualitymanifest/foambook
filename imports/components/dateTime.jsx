import React from "react";
import { asField } from "informed";
import NumberFormat from "react-number-format";

export default asField(({ fieldState, fieldApi, ...props }) => {
	const { getValue, setValue, setTouched } = fieldApi;
	const { onChange, onBlur, initialValue, forwardedRef, ...rest} = props;
	return (
		<React.Fragment>
			<NumberFormat
				{...rest}
				format="##-##-## ##:##"
				value={getValue()}
				onChange={e => setValue(e.target.value)}
				onBlur={() => setTouched()}
				style={fieldState.error ? { border: "solid 1px red" } : null}
			/>
			{fieldState.error && fieldState.error !== "error-no-description" ? (
				<p className="form-error">{fieldState.error}</p>
			) : null}
		</React.Fragment>
	);
});
