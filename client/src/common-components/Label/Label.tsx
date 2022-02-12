import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import './style.scss';

export type Props = {
  customLabel?: string;
} & TypographyProps;

export const Label = (props: Props) => {
    const { children, customLabel, className = '', classes,  ...rest } = props;
    let labelClass = `common-label ${className}`;
    if (customLabel) labelClass = customLabel;
  return <Typography classes={classes || {root: labelClass}} {...rest}>{children}</Typography>;
};

export default Label;
