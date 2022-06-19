import React, { Component } from 'react'
import PropTypes from "prop-types";
import './view_charity_event_details.css';
import BackSection from '../../../components/BackSection';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class ViewCharityEventDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title:"",
            purpose:"",
            description:"",
            location:"",
            amount:0,
            preregister_start_date:null,
            preregister_end_date:null,
            donation_start_date:null,
            donation_end_date:null,
            document:null,
            photo:null
        };
        this.imageUploadInput = React.createRef();
        this.imageDisplay = React.createRef();
        this.fileUploadInput = React.createRef();
        this.fileTextDisplay = React.createRef();
    }

    handleTitleOnChange(event){
        this.setState({title:event.target.value});
    }

    handlePurposeOnChange(event){
        this.setState({purpose:event.target.value});
    }

    handleDescriptionOnChange(event){
        this.setState({description:event.target.value});
    }

    handleLocationOnChange(event){
        this.setState({location:event.target.value});
    }

    handleAmountOnChange(event){
        this.setState({amount:event.target.value});
    }
    
    handlePreregistrationStartDateOnChange(event){
        this.setState({preregister_start_date:event.target.value});
    }
    
    handlePreregistrationEndDateOnChange(event){
        this.setState({preregister_end_date:event.target.value});
    }

    handleDonationStartDateOnChange(event){
        this.setState({donation_start_date:event.target.value});
    }

    handleDonationEndDateOnChange(event){
        this.setState({donation_end_date:event.target.value});
    }

    handleTextInputOnClick(){
        this.fileUploadInput.current.click();
    }

    handleFileOnChange(event){
        const setDocumentUploaded = (documentUploaded) =>{
            this.setState({document:documentUploaded});
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            setDocumentUploaded({
                name:event.target.files[0].name,
                content:reader.result
            });
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        this.fileTextDisplay.current.value = this.fileUploadInput.current.files[0].name;
    }

    handleImageOnClick(){
        this.imageUploadInput.current.click();
    }

    handleImageOnChange(event){
        const setPhotoUploaded=(photoUploaded)=>{
            this.setState({photo:photoUploaded});
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            setPhotoUploaded({
                name:event.target.files[0].name,
                content:reader.result
            });
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        this.imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    handleSubmit(event){
        event.preventDefault();
        fetch('/charity_event',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                title:this.state.title,
                purpose:this.state.purpose,
                description:this.state.description,
                location:this.state.location,
                amount:this.state.amount,
                preregister_start_date:this.state.preregister_start_date,
                preregister_end_date:this.state.preregister_end_date,
                donation_start_date:this.state.donation_end_date,
                donation_end_date:this.state.donation_end_date,
                document:this.state.document,
                photo:this.state.photo
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log(data.message);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    render() {
        return (
            <React.Fragment id="create-charity-event-section">
                <BackSection title="View Charity Event"/>
                <form onSubmit={event=>this.handleSubmit(event)}>
                    <div id="create-form-upper-part">
                        <div id="form-left-content">
                            <span className="short-input">
                                <label >TITLE</label>
                                <input type="text" name="title" onChange={event=>this.handleTitleOnChange(event)}/>
                            </span>
                            <span className="long-input">
                                <label >PURPOSE</label>
                                <textarea name="purpose" onChange={event=>this.handlePurposeOnChange(event)}/>
                            </span>
                            <span className="long-input">
                                <label >DESCRIPTION</label>
                                <textarea name="description" onChange={event=>this.handleDescriptionOnChange(event)}/>
                            </span>
                        </div>
                        <div id="form-right-content">
                            <span className="short-input">
                                <label >LOCATION</label>
                                <input type="text" name="location" onChange={event=>this.handleLocationOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >TARGET AMOUNT(RM)</label>
                                <input type="number" name="amount" onChange={event=>this.handleAmountOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >PREREGISTRATION START DATE</label>
                                <input type="date" name="preregistration_start_date" onChange={event=>this.handlePreregistrationStartDateOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >PREREGISTRATION END DATE</label>
                                <input type="date" name="preregistration_end_date" onChange={event=>this.handlePreregistrationEndDateOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >DONATION START DATE</label>
                                <input type="date" name="donation_start_date" onChange={event=>this.handleDonationStartDateOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >DONATION END DATE</label>
                                <input type="date" name="donation_end_date" onChange={event=>this.handleDonationEndDateOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >SUPPORTING DOCUMENT</label>
                                <input className="hidden" ref={this.fileUploadInput} onChange={event=>this.handleFileOnChange(event)} type="file" accept=".zip,.rar,.7zip" name="document"/>
                                <input ref={this.fileTextDisplay} onClick={this.handleTextInputOnClick} type="text" defaultValue="No file is chosen"/>
                            </span>
                            <p id="file-upload-reminder">* Please upload your charity event proposal together with supporting documents in zip files</p>
                        </div>
                    </div>
                    <span className="file-upload">
                        <label >COVER PHOTO</label>
                        <input className="hidden" ref={this.imageUploadInput} type="file" accept="image/*" onChange={event=>this.handleImageOnChange(event)}/>
                        <img ref={this.imageDisplay} src="data:," name="image" onClick={this.handleImageOnClick}/>
                    </span>
                    <input type="submit" value="Create" id="create-button"/>
                </form>
            </React.Fragment>
        )
    }
}

ViewCharityEventDetails.propTypes = propTypes;
ViewCharityEventDetails.defaultProps = defaultProps;

export default ViewCharityEventDetails;