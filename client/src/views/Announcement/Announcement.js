import React, { Component } from 'react';
import PropTypes from "prop-types";
import './announcement.css';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class Announcement extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
        this.fileUploadInput = React.createRef();
        this.imageDisplay = React.createRef();
        this.handleImageOnClick=this.handleImageOnClick.bind(this);
        this.handleFileInputOnChange=this.handleFileInputOnChange.bind(this);
    }

    handleImageOnClick(){
        this.fileUploadInput.current.click();
    }

    handleFileInputOnChange(event){
        this.imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    render() {
        return (
            <form>
                <span className="file-upload">
                    <label >Cover Photo</label>
                    <input ref={this.fileUploadInput} type="file" accept="image/*" id="fileInput" onChange={this.handleFileInputOnChange}/>
                    <img ref={this.imageDisplay} src="data:," onClick={event=>this.handleImageOnClick(event)}/>
                </span>
            </form>
        )
  }
}

Announcement.propTypes = propTypes;
Announcement.defaultProps = defaultProps;

export default Announcement;