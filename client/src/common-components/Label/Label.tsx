import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import './style.scss';

export type Props = {
  customLabel?: string;
} & TypographyProps;

export const Label = (props: Props) => {
    const { children, customLabel,  ...rest } = props;
    const labelClass = `common-label ${customLabel}`;
  return <Typography className={labelClass} {...rest}>{children}</Typography>;
};

export default Label;
