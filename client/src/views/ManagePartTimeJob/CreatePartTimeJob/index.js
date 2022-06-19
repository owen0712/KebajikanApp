import React, { Component } from 'react'
import {BackSection} from '../../../components';
import PropTypes from "prop-types";
import './create_parttime_job.css';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class CreatePartTimeJob extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title:"",
            required_student:0,
            description:"",
            location:"",
            allowance:0,
            closed_date:null,
            photo:null
        };
        this.imageUploadInput = React.createRef();
        this.imageDisplay = React.createRef();
    }

    handleTitleOnChange = (event) =>{
        this.setState({title:event.target.value});
    }

    handleRequiredStudentOnChange = (event) =>{
        if (event.target.value>=0)
            this.setState({required_student:event.target.value});
        else{
            this.setState({allowance:0});
            event.target.value="";
        }
    }

    handleDescriptionOnChange = (event) =>{
        this.setState({description:event.target.value});
    }

    handleLocationOnChange = (event) =>{
        this.setState({location:event.target.value});
    }

    handleAllowanceOnChange = (event) =>{
        if (event.target.value>=0)
            this.setState({allowance:event.target.value});
        else{
            this.setState({allowance:0});
            event.target.value="";
        }
    }
    
    handleClosedDateOnChange = (event) =>{
        this.setState({closed_date:event.target.value});
    }

    handleFileOnChange = (event) =>{
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

    handleImageOnClick = () =>{
        this.imageUploadInput.current.click();
    }

    handleImageOnChange = (event) =>{
        const setPhotoUploaded=(photoUploaded)=>{
            this.setState({photo:photoUploaded});
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            setPhotoUploaded({
                name:event.target.files[0].name,
                content:reader.result,
            });
        }
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        this.imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    handleSubmit = (event) =>{
        event.preventDefault();
        console.log(this.state)
        fetch('/part_time_job',{
            method:'post',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                title:this.state.title,
                required_student:this.state.required_student,
                description:this.state.description,
                location:this.state.location,
                allowance:this.state.allowance,
                closed_date:this.state.closed_date,
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
            <React.Fragment id="createPartTimeJob">
                <BackSection title="Create Part-Time Job"/>
                <form onSubmit={event=>this.handleSubmit(event)}>
                    <div id="upper-part">
                        <div id="form-left-content">
                            <span className="short-input">
                                <label >TITLE</label>
                                <input type="text" name="title" onChange={event=>this.handleTitleOnChange(event)}/>
                            </span>
                            <span className="long-input">
                                <label >DESCRIPTION</label>
                                <textarea name="description" onChange={event=>this.handleDescriptionOnChange(event)}/>
                            </span>
                        </div>
                        <div id="form-right-content">
                            <span className="short-input">
                                <label >REQUIRED STUDENT</label>
                                <input type="number" name="amount" onChange={event=>this.handleRequiredStudentOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >LOCATION</label>
                                <input type="text" name="location" onChange={event=>this.handleLocationOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >ALLOWANCE (RM)</label>
                                <input type="number" name="amount" onChange={event=>this.handleAllowanceOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >CLOSED DATE</label>
                                <input type="date" name="preregistration_start_date" onChange={event=>this.handleClosedDateOnChange(event)}/>
                            </span>
                        </div>
                    </div>
                    <span className="file-upload">
                        <label >COVER PHOTO</label>
                        <input className="hidden" ref={this.imageUploadInput} type="file" accept="image/*" onChange={event=>this.handleImageOnChange(event)}/>
                        <img ref={this.imageDisplay} alt="" src="data:," name="image" onClick={this.handleImageOnClick}/>
                    </span>
                    <input type="submit" value="Create" id="create-button"/>
                </form>
            </React.Fragment>
        )
    }
}

CreatePartTimeJob.propTypes = propTypes;
CreatePartTimeJob.defaultProps = defaultProps;

export default CreatePartTimeJob;