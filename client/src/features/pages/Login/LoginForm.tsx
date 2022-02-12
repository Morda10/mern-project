import { AppDispatch } from 'app/store';
import { Button, GridMaker, Input, Label } from 'common-components';
import { increment } from 'features/counter/counterSlice';
import React, { Component } from 'react';
import { InjectedFormProps } from 'redux-form';
import { connectReduxForm } from 'utils/formUtils/formUtils';
import { LOGIN_TITLE } from './consts';

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
                    alignItems="center"
                    justifyContent="center"
                    rowSpacing={3}
                    direction="column"
                    gridItemsProps={[{xs: 12}, {xs: 6}, {xs: 6}]}
                >
                    {this.renderLoginTitle()}
                    <Input name='email' type="email" label="Email: " inputGridMakerProps={{ columnSpacing: 1 }} labelProps={{ align: 'center' }} />
                    <Input name='password' type="password" label="Password: " inputGridMakerProps={{ columnSpacing: 1 }} />
                    <Button type='submit'>Submit</Button>
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