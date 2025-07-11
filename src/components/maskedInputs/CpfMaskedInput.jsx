import React from 'react';
import { IMaskInput } from 'react-imask';

const CpfMaskedInput = React.forwardRef(function CpfMaskedInput(props, ref) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask="000.000.000-00"
      definitions={{
        '#': /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default CpfMaskedInput;
