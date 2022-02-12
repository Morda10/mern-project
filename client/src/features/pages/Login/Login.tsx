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
    isLogin: boolean;
    increment: ActionCreatorWithoutPayload<string>
};

export class Login extends Component<Props> {

    

    render() {
        return (
            <GridMaker className='login-page' alignItems="center" justifyContent="center">
                <Card elevation={1} className='login-card'>
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                </Card>
            </GridMaker>
            );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        count: state.counter.value,
        isLogin: state.authentication.isLogin
    }
};

const mapDispatchToProps = { increment };

export default connectToStore(Login,
    {mapStateToProps, mapDispatchToProps}
);
