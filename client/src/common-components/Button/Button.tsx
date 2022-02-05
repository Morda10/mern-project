import React from 'react';
import ButtonMui from '@mui/material/Button';
import {ButtonProps as ButtonMuiProps} from '@mui/material';
import './style.scss';

export type Props = {
    customButton?: string;
    small?: boolean;
    link?: boolean;
    iconButton?: boolean;
    primary?: boolean;
    secondary?: boolean;
    negative?: boolean;
} & ButtonMuiProps;

export const Button = (props: Props) => {
    const {
         children,
         customButton,
         className,
         secondary,
         primary,
         small,
         iconButton,
         link,
         negative,
          ...rest
     } = props;

     let buttonClassName = 'common-button';
     if (className) {
        buttonClassName = `${buttonClassName} ${className}`;
     }
     buttonClassName = `${buttonClassName} ${small ? 'small' : ''} ${link ? 'link' : ''} ${secondary ? 'secondary' : ''} ${negative ? 'negative' : ''}`
     if (customButton) {
        buttonClassName = customButton;
     }

    return (
        <ButtonMui
            className={buttonClassName}
            {...rest}
        >
            {children}
        </ButtonMui>
    );
};

export default Button;
