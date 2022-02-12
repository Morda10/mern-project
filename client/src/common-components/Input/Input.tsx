import { TextField, TextFieldProps } from '@mui/material';
import { GridMaker, Label } from 'common-components';
import { Props as GridMakerProps } from 'common-components/GridMaker/GridMaker';
import { Props as LabelProps } from 'common-components/Label/Label';
import React from 'react';
import { WrappedFieldProps } from 'redux-form';
import './style.scss';

export type Props = {
  customInput?: string;
  inputGridMakerProps?: GridMakerProps;
  labelProps?: LabelProps;
} & TextFieldProps;

export const Input = (props: Props & WrappedFieldProps) => {
  const {
     input, className = '', customInput = '',
     label, inputGridMakerProps, labelProps,
     ...rest
 } = props;
 const { className: labelClassName = '' } = labelProps || {};
 const labelClass = `common-input-label ${labelClassName}`;
  let inputClassName = `common-input ${className}`;
  if (customInput) inputClassName = customInput;
  
  return( 
      <GridMaker {...inputGridMakerProps}>
        {label && <Label className={labelClass} {...labelProps}>{label}</Label>}
        <TextField
          classes={{ root: inputClassName}}
          {...input}
          {...(rest as TextFieldProps)}
      />
      </GridMaker>
     );
};

export default Input;
