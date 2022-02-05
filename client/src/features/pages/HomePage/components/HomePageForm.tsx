import React, { Component } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { Dropdown, GridMaker, Input } from '../../../../common-components';

export type Props = {
};

export class HomePageForm extends Component<Props & InjectedFormProps> {
  render() {
    return( 
        <form>
            <GridMaker alignItems="center" justifyContent="center">
                <Dropdown name="morDropdown" values={[{ value: 'mor' }, { value: 'regev' }, { value:'ofmwfosmd' }]} />
                <Input name='mor' />
            </GridMaker>
        </form>
    );
  }
}

export default reduxForm({form: 'morForm'})(HomePageForm);