import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

export type Props = {

} & TypographyProps;


export const Label = (props: Props) => {
    const { children, ...rest } = props;
  return <Typography {...rest}>{children}</Typography>;
};
