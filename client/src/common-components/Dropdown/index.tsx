import React from 'react';
import {Props as DropdownProps} from './Dropdown';
import { BaseFieldProps, Field } from 'redux-form';
import { Dropdown } from './Dropdown';

export type Props = {

} & BaseFieldProps & DropdownProps; 


export const dropdownField = (props: Props) => {
    return (
        <Field
            {...(props as BaseFieldProps)}
            component={Dropdown}
        />            
    );
};

export default dropdownField;
