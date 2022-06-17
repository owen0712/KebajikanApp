import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

export default class Navigation extends Component {
    constructor(props){
        super(props);
        this.state={
            toObject:null,
            isPush:false
        }
    }

    replace = (destination, search, state) =>{

        let toObject = {
            pathname:destination,
            search:search,
            state:state,
        }
        this.setState({
            toObject:toObject
        })

    }

    pushTo = (destination, search, state) =>{

        let toObject = {
            pathname:destination,
            search:search,
            state:state,
        }
        this.setState({
            toObject:toObject,
            isPush:true
        })
    }

    render(){
        return(
            <React.Fragment>
            {
                !!this.state.toObject?
                (<Navigate push={this.state.isPush} to={this.state.toObject} />):
                (null)
            }
            {
                this.props.render?this.props.render(this):(null)
            }
            </React.Fragment>
        )
    }
}