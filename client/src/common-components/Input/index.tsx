import React from 'react';
import {Props as InputProps} from './Input';
import { BaseFieldProps, Field } from 'redux-form';
import Input from './Input';

export type Props = {

} & BaseFieldProps & InputProps; 


export const inputField = (props: Props) => {
    const { ...rest } = props;
    return (
        <Field
            component={Input}
            {...(rest as BaseFieldProps)}
        />       
    );
};

export default inputField;
