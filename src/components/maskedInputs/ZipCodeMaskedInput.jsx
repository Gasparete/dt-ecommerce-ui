import React from "react";
import { IMaskInput } from "react-imask";

const ZipCodeMaskedInput = React.forwardRef(function ZipCodeMaskedInput(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask="00000-000"
      definitions={{
        "#": /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default ZipCodeMaskedInput;