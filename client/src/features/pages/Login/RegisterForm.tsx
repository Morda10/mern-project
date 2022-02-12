import { AppDispatch } from 'app/store';
import React, { Component } from 'react'
import { connectReduxForm } from 'utils/formUtils/formUtils';

export class RegisterForm extends Component {
  render() {
    return (
      <div>RegisterForm</div>
    )
  }
}

const handleSubmit = (values: any, dispatch: AppDispatch) => {
    console.log(values);
}

export default connectReduxForm(RegisterForm, 
    null,
    { },
    { form: "login", onSubmit: handleSubmit }
    );