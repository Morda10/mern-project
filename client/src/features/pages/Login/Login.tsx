import React, { Component } from 'react';
import { GridMaker, Card } from 'common-components';
import { connectToStore } from 'utils/connectComponent/connectToStore';
import { increment } from 'features/counter/counterSlice';
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import './style.scss';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { authenticationSelectors } from 'app/actions/authentication';

export type Props = {
    
};

export interface OwnProps extends Props {
    count: number;
    isLogin: boolean;
    increment: ActionCreatorWithoutPayload<string>
}

export class Login extends Component<OwnProps> {

    render() {
        const { isLogin } = this.props;
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
        isLogin: authenticationSelectors.getIsLogin(state)
    }
};

const mapDispatchToProps = { increment };

export default connectToStore(Login,
    {mapStateToProps, mapDispatchToProps}
);
