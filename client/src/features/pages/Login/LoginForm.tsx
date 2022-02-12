import { AppDispatch } from 'app/store';
import { Button, GridMaker, Input, Label } from 'common-components';
import { increment } from 'features/counter/counterSlice';
import React, { Component } from 'react';
import { InjectedFormProps } from 'redux-form';
import { connectReduxForm } from 'utils/formUtils/formUtils';
import { CREATE_ACCOUNT, LOGIN_TITLE, SIGN_IN } from './consts';

export type FormValues = {
    email: string;
    password: string;
};
export type Props = {
    onSubmit: (values: FormValues, dispatch: AppDispatch) => void;
};

export class LoginForm extends Component<Props & InjectedFormProps> {
    renderLoginTitle () {
        return <Label variant='h4' className='login-title'>{LOGIN_TITLE}</Label>
    }
  render() {
    const { handleSubmit, onSubmit } = this.props;
    return (
            <form onSubmit={handleSubmit.bind(onSubmit)}>
                <GridMaker
                    className="login-form-container"
                    alignItems="flex-start"
                    justifyContent="flex-start"
                    rowSpacing={3}
                    // direction="column"
                    gridItemsProps={[{xs: 12, className: 'login-title-item'}, {}, {xs: 12}, { xs: 12, className: 'create-account-item' }]}
                >
                    {this.renderLoginTitle()}
                    <GridMaker
                        direction="column"
                        gridItemsProps={[{xs: 12, className: 'login-form-input-email'}, { xs: 12, className: 'login-form-input-password' }]}
                    >
                        <Input
                            name='email'
                            type="email"
                            label="Email: "
                            inputGridMakerProps={{ columnSpacing: 1 }}
                            labelProps={{ align: 'center', className: 'login-form-input-label' }}
                        />
                        <Input
                            name='password'
                            type="password"
                            label="Password: "
                            inputGridMakerProps={{ columnSpacing: 1 }}
                            labelProps={{ className: 'login-form-input-label' }}
                        />
                    </GridMaker>
                    <Button type='submit'>{SIGN_IN}</Button>
                    <Button link>{CREATE_ACCOUNT}</Button>
                </GridMaker>
            </form>
    );
  }
}

const handleSubmit = (values: any, dispatch: AppDispatch) => {
    console.log(values);
    dispatch(increment());
}

export default connectReduxForm(LoginForm, 
    null,
    { increment },
    { form: "login", onSubmit: handleSubmit }
    );