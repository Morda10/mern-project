import React, { Component } from 'react';
import { GridMaker, Card } from 'common-components';
import { connectToStore } from 'utils/connectComponent/connectToStore';
import { increment } from 'features/counter/counterSlice';
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import './style.scss';
import LoginForm from './LoginForm';

export type Props = {
    count: number;
    increment: ActionCreatorWithoutPayload<string>
};

export class Login extends Component<Props> {

    

    render() {
        return (
            <GridMaker className='login-page' alignItems="center" justifyContent="center">
                <Card className='login-card'>
                    <LoginForm />
                </Card>
            </GridMaker>
            );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        count: state.counter.value
    }
};

const mapDispatchToProps = { increment };

export default connectToStore(Login,
    {mapStateToProps, mapDispatchToProps}
);
