import React,{ Component } from 'react';
import './BackSection.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import RepeatIcon from '@mui/icons-material/Repeat';

class BackSection extends Component{
    
    render(){
        return(
            <div id="back-section">
                <button id="back-button" onClick={this.props.onBackButtonClick}>
                    <ArrowBackIcon id="back-icon"/>
                    {(!this.props.title) && <span id="back-text">Back</span>}
                    {(this.props.previousIsHome===true) && <HomeIcon id="back-icon"/>}
                </button>
                {(this.props.title) && <p className="back-section-title">{this.props.title}</p>}
                {(this.props.createButtonName)&&(this.props.handleButtonCreate) && <button className="create-button" onClick={this.props.handleButtonCreate}>{this.props.isTransferIcon?<RepeatIcon id="transfer-icon"/>:<AddIcon id="add-icon"/>}{this.props.createButtonName}</button>}
            </div>
        )
    }
}

BackSection.defaultProps ={
    isTransferIcon:false
}

export default BackSection;