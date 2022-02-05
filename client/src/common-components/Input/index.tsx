import React from 'react';
import {Props as InputProps} from './Input';
import { BaseFieldProps, Field } from 'redux-form';
import Input from './Input';

export type Props = {

} & BaseFieldProps & InputProps; 


export const inputField = (props: Props) => {
    return (
        <Field
            {...(props as BaseFieldProps)}
            component={Input}
        />            
    );
};

export default inputField;
