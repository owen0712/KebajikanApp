import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Navigation } from '../../core';

export default class NavRoute extends Component {

render(){
        const { component: Component, ...restProps } = this.props; 
        return(
            <Route {...restProps} render={props => (
                <React.Fragment>
                    <Navigation render={ref =>(
                        <Component {...props} navigation={{...ref, ...props.history}}/>
                    )}/>
                </React.Fragment>
            )}/>
        )
    }
}
