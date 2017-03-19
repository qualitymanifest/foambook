import React from 'react';
import { FormInput } from 'react-form';
import NumberFormat from 'react-number-format';

export default ({ field, ...rest }) => (
    <FormInput field={field}>
      {({ setValue, getValue, setTouched }) => (
          <NumberFormat
format="##-##-## ##:##"
          	{...rest}
          	value={getValue()}
            onChange={e => setValue(e.target.value)}
            onBlur={() => setTouched()}
          />
        )}
    </FormInput>
  );
