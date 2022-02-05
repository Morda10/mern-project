import React, { Component } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { Dropdown, GridMaker, Input, Button } from '../../../../common-components';

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
                <GridMaker alignItems="center" justifyContent="center" gridItemsProps={[{xs: 4}, {xs: 4}, {xs: 4}]}>
                    <Dropdown name="morDropdown" values={[{ value: 'mor' }, { value: 'regev' }, { value:'ofmwfosmd' }]} />
                    <Input name='mor' />
                    <Button type='submit'>Submit</Button>
                </GridMaker>
            </form>
        );
    }

}
export default reduxForm({form: 'morForm'})(HomePageForm);