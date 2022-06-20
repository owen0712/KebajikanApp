import React,{ Component } from 'react';
import './Status.css';

class Status extends Component{
    
    render(){
        return(
            <span className="status" id={this.props.statusName.toLowerCase().replace(' ','-')+"-status"}>{this.props.statusName}</span>
        )
    }
}

export default Status;