import React from 'react';
import { MenuItem, Select, SelectProps } from '@mui/material';
import { WrappedFieldProps } from 'redux-form';

export type DropdownValue = {
    id?: string;
    value: string;
    label?: React.ReactNode | string;
};

// type FilteredProps = Omit<SelectProps, 'input'>;

export type Props = {
    values: DropdownValue[];
} & SelectProps;

export const Dropdown = (props: Props & WrappedFieldProps) => {
    const { values, input,  ...rest } = props;
    const dropdownValues = values?.map(dropdownValue => {
        const { id, value, label } = dropdownValue;
        return <MenuItem key={id || value} value={value}>{label || value}</MenuItem>;
    })
  return (
    <Select {...rest} {...input}>
        {dropdownValues}
    </Select>
    );
};
