import React, { Component } from 'react';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Dropdown, GridMaker, Input, Button } from '../../../../common-components';
// import { connectReduxForm } from '../../../../utils/formUtils/formUtils';
// import { FormConfigProps } from '../../../../utils/formUtils/types';

export type Props = {
};

export class HomePageForm extends Component<Props & InjectedFormProps> {
    // constructor(props: Props) {
    //     super(props);
    //     this.handleSubmit = this.bind.handleSubmit;
    // }
    render() {
        return( 
            <form>
                <GridMaker alignItems="center" justifyContent="center">
                    <Dropdown name="morDropdown" values={[{ value: 'mor' }, { value: 'regev' }, { value:'ofmwfosmd' }]} />
                    <Input name='mor' />
                    <Field
                        name="lastName"
                        component="input"
                        type="text"
                        placeholder="Last Name"
                      />
                    <Button type='submit'>Submit</Button>
                </GridMaker>
            </form>
        );
    }

}
export default reduxForm({form: "mfsodfmd"})(HomePageForm);