import React from 'react';
import {Grid, GridProps} from '@mui/material';

export type Props = {
    gridItemsProps?: GridProps[];
} & GridProps;

export const GridMaker = (props: Props) => {
    const { children, gridItemsProps, ...rest } = props;
    const gridItems = React.Children.map(children, ((child, index) => {
        const currentGridItemProps = gridItemsProps && gridItemsProps[index];
        return (
            <Grid item {...currentGridItemProps}>
                {child}
            </Grid>
        );
    }))
  return <Grid container {...rest}>{gridItems}</Grid>;
};

export default GridMaker;
