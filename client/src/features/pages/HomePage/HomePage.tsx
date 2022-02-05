import React, { Component } from 'react';
import './style.scss';
import { Card, Grid } from '@mui/material';
import { Label } from '../../../common-components/Label/Label';
import { GridMaker, Button } from '../../../common-components';
import HomePageForm from './components/HomePageForm';



export type Props = {

};

export default class HomePage extends Component<Props> {
    
    
  renderHomePageTitle() {
        return (
            <div className='home-page-title-container'>
                <Label variant='h4' className='home-page-title'>Home page</Label>
            </div>
        );
  } 

  renderHomePageContent() {
        return (
            <Card className="home-page-content-card">
                <Grid container direction="column" alignItems="center" justifyContent="center">
                    <Grid item>
                        <Label>Content</Label>
                    </Grid>
                    <Grid item>
                        <Label>
                            wfoewinfoienfoeirfnreoinoieroinerfoienroinerione
                            ewfjbsdikvbfdsiuj
                        </Label>
                    </Grid>
                </Grid>
            </Card>
        );
  }   

  render() {
    
    return (
        <div className='home-page'>
            <Grid container direction="column" alignItems="center" justifyContent="center" rowSpacing={4}>
                <Grid item>
                    {this.renderHomePageTitle()}
                </Grid>
                <Grid item>
                    {this.renderHomePageContent()}
                </Grid>
                <Grid item>
                    <Label variant='h1' className='regev'>Regev Zbalck website</Label>
                    <GridMaker direction="column" rowGap={2} justifyContent="center" >
                        <Button small>Mor Button</Button>
                        <Button secondary>Mor Button secondary</Button>
                    </GridMaker>
                    <GridMaker gridItemsProps={[{xs: 3}, {xs: 4}]}>
                        <Button small>Mor Button</Button>
                        <Button secondary>Mor Button secondary</Button>
                    </GridMaker>
                    <HomePageForm /> 
                </Grid>
            </Grid>
        </div>
        );
  }
}
