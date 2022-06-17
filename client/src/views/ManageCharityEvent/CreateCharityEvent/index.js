import React, { Component } from 'react'
import PropTypes from "prop-types";
import './create_charity_event.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class CreateCharityEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.fileUploadInput = React.createRef();
        this.imageDisplay = React.createRef();
        this.handleImageOnClick=this.handleImageOnClick.bind(this);
        this.handleFileInputOnChange=this.handleFileInputOnChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    handleImageOnClick(){
        this.fileUploadInput.current.click();
    }

    handleFileInputOnChange(event){
        this.imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    handleSubmit(event){

    }

    render() {
        return (
            <React.Fragment>
                <span id="back-section">
                    <ArrowBackIcon id="back-icon"/>
                    <a>Back</a>
                </span>
                <form onSubmit={event=>this.handleSubmit(event)}>
                    <div id="upper-part">
                    <div id="form-left-content">
                        <span className="short-input">
                            <label >TITLE</label>
                            <input type="text" name="title"/>
                        </span>
                        <span className="long-input">
                            <label >PURPOSE</label>
                            <input type="text" name="purpose"/>
                        </span>
                        <span className="long-input">
                            <label >DESCRIPTION</label>
                            <input type="text" name="description"/>
                        </span>
                    </div>
                    <div id="form-right-content">
                        <span className="short-input">
                            <label >LOCATION</label>
                            <input type="text" name="location"/>
                        </span>
                        <span className="short-input">
                            <label >TARGET AMOUNT(RM)</label>
                            <input type="number" name="amount"/>
                        </span>
                        <span className="short-input">
                            <label >PREREGISTRATION START DATE</label>
                            <input type="date" name="preregistration_start_date"/>
                        </span>
                        <span className="short-input">
                            <label >PREREGISTRATION END DATE</label>
                            <input type="date" name="preregistration_end_date"/>
                        </span>
                        <span className="short-input">
                            <label >DONATION START DATE</label>
                            <input type="date" name="donation_start_date"/>
                        </span>
                        <span className="short-input">
                            <label >DONATION END DATE</label>
                            <input type="date" name="donation_end_date"/>
                        </span>
                        <span className="short-input">
                            <label >SUPPORTING DOCUMENT</label>
                            <input type="file" name="document"/>
                        </span>
                    </div>
                    </div>
                    <span className="file-upload">
                        <label >COVER PHOTO</label>
                        <input ref={this.fileUploadInput} type="file" accept="image/*" id="fileInput" onChange={this.handleFileInputOnChange}/>
                        <img ref={this.imageDisplay} src="data:," name="image" onClick={event=>this.handleImageOnClick(event)}/>
                    </span>
                    <input type="submit" value="Create" id="create-button"/>
                </form>
            </React.Fragment>
        )
    }
}

CreateCharityEvent.propTypes = propTypes;
CreateCharityEvent.defaultProps = defaultProps;

export default CreateCharityEvent;