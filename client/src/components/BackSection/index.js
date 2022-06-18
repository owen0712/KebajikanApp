import React,{ Component } from 'react';
import './BackSection.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

class BackSection extends Component{
    
    render(){
        return(
            <div id="back-section">
                <button id="back-button" onClick={this.props.onClick}>
                    <ArrowBackIcon id="back-icon"/>
                    {(!this.props.title) && <span id="back-text">Back</span>}
                    {(this.props.previousIsHome===true) && <HomeIcon id="back-icon"/>}
                </button>
                {(this.props.title) && <p className="back-section-title">{this.props.title}</p>}
            </div>
        )
    }
}

export default BackSection;