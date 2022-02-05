import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { WrappedFieldProps } from 'redux-form';

export type Props = {

} & TextFieldProps;

export const Input = (props: Props & WrappedFieldProps) => {
  const { input, ...rest } = props;
  return <TextField {...input} {...rest} />;
};

export default Input;
