import React from 'react';
import { Card as CardMui, CardProps } from '@mui/material';
import './style.scss';


export type Props = {
    customCard?: string;
} & CardProps;

export const Card = (props: Props) => {
    const { children, className = '', customCard, ...rest } = props; 
    let cardClass = `common-card ${className}`;
    if (customCard) {
        cardClass = customCard;
    }

  return <CardMui className={cardClass} {...rest}>{children}</CardMui>;
};

export default Card;