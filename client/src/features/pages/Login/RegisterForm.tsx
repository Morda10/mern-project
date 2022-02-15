import { AppDispatch, RootState } from 'app/store';
import { Button, GridMaker, Label } from 'common-components';
import { Input } from 'common-components';
import React, { Component } from 'react'
import { initialize, InjectedFormProps } from 'redux-form';
import { authenticationSelectors, register } from 'app/actions/authentication';
import { connectReduxForm } from 'utils/formUtils/formUtils';
import { REGISTER_TITLE } from './consts';

export type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
};

export type Props = {
  onSubmit: (values: FormValues, dispatch: AppDispatch) => void;
};

export interface OwnProps extends Props {
  registerErrors: string[];
  registerResponse: string[];
  initForm: (formName: string, data: FormValues) => void;
}


export class RegisterForm extends Component<OwnProps & InjectedFormProps> {
  componentDidMount() {
    const { initForm, form } = this.props;
    initForm(form, {
      username: "morsdfnsod",
      email: "morwiosfnr@gmail.com",
      password: "AAAbbb123",
      confirmPassword: "AAAbbb123",
      phoneNumber: "0502448783",
      firstName: "mor",
      lastName: "dahan"
    });
  }
  renderRegisterTitle() {
    return (
      <Label>{REGISTER_TITLE}</Label>
    );
  }

  render() {
    const { onSubmit, handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit.bind(onSubmit)}>
        <GridMaker className='register-form-container' direction="column" rowSpacing={3}>
          {this.renderRegisterTitle()}
          <GridMaker direction="column" rowSpacing={3} alignItems="flex-start" justifyContent="space-between">
            <Input name="username" label="username" />
            <Input name="email" type="email" label="email" />
            <Input name="password" type="password" label="password" />
            <Input name="confirmPassword" type="password" label="confirmPassword" />
            <Input name="phoneNumber" label="phoneNumber" />
            <Input name="firstName" label="firstName" />
            <Input name="lastName" label="lastName" />
            <Button type="submit">Sign up</Button>
          </GridMaker>
        </GridMaker>
      </form>
    )
  }
}

const handleSubmit = (values: any, dispatch: AppDispatch) => {
    dispatch(register(values));
}

export default connectReduxForm(RegisterForm, 
    (state: RootState) => {
      return {
        registerErrors: authenticationSelectors.getRegisterErrors(state),
        registerResponse: authenticationSelectors.getRegisterResponse(state)
    }},
    (dispatch: AppDispatch) => {
      return {
        initForm: (formName: string, data: FormValues) => dispatch(initialize(formName, data))
      }
    },
    { form: "register", onSubmit: handleSubmit }
    );