import React, { Component } from 'react'
import {useNavigate} from "react-router-dom";
import {BackSection} from '../../../components';
import PropTypes from "prop-types";
import './view_part_time_job_details.css';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class ViewPartTimeJobDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title:"",
            required_student:0,
            description:"",
            location:"",
            allowance:0,
            closed_date:"",
            photo:null,
            isDisable:true
        };
        this.imageUploadInput = React.createRef();
        this.imageDisplay = React.createRef();
    }

    componentDidMount(){
        const path = window.location.pathname;
        const id  = path.substring(path.lastIndexOf("/")+1);
        console.log("ID",id);
        fetch('/part_time_job/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then((res)=>{
            const json = res.json();
            Promise.resolve(json.then((data)=>{
                return data.event;
            }).then((info)=>{
                info.map((job)=>{
                    this.setState({
                        title:job.title,
                        required_student:job.required_student,
                        description:job.description,
                        location:job.location,
                        allowance:job.allowance,
                        closed_date:this.convertDateFormat(job.closed_date),
                        photo:job.photo,
                    })
                    console.log("date",new Date(job.closed_date).toLocaleDateString());
                })    
            }))
            return json;
        }).catch(err=>{
            console.log(err);
        })
        
    }

    convertDateFormat = (rawDate) =>{
        var monthNames = [
            "JAN", "FEB", "MAR",
            "APR", "MAY", "JUN", "JUL",
            "AUG", "SEP", "OCT",
            "NOV", "DEC"
            ];
        let tempDate = new Date(rawDate);
        let tempYear = tempDate.getFullYear();
        let tempMonth = tempDate.getMonth()+1;
        let tempDay = tempDate.getDate();
        const newDate = tempYear + "-" + (tempMonth.toString().length < 2 ? "0" +tempMonth : tempMonth) + "-" + (tempDay.toString().length < 2 ? "0" + tempDay : tempDay);
        console.log("Not format:", tempDate.toLocaleDateString);
        console.log("Format:", newDate);
        return newDate
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
            <React.Fragment>
                <BackSection title="View Part-Time Job Details" onBackButtonClick={()=>{window.history.back()}}/> 
                <form onSubmit={event=>this.handleSubmit(event)}>
                    <div id="upper-part">
                        <div id="form-left-content">
                            <span className="short-input">
                                <label >TITLE</label>
                                <input disabled={this.state.isDisable} value={this.state.title} type="text" name="title" onChange={event=>this.handleTitleOnChange(event)}/>
                            </span>
                            <span className="long-input">
                                <label >DESCRIPTION</label>
                                <textarea disabled={this.state.isDisable} value={this.state.description} name="description" onChange={event=>this.handleDescriptionOnChange(event)}/>
                            </span>
                        </div>
                        <div id="form-right-content">
                            <span className="short-input">
                                <label >REQUIRED STUDENT</label>
                                <input disabled={this.state.isDisable} value={this.state.required_student} type="number" name="amount" onChange={event=>this.handleRequiredStudentOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >LOCATION</label>
                                <input disabled={this.state.isDisable} value={this.state.location} type="text" name="location" onChange={event=>this.handleLocationOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >ALLOWANCE (RM)</label>
                                <input disabled={this.state.isDisable} value={this.state.allowance} type="number" name="amount" onChange={event=>this.handleAllowanceOnChange(event)}/>
                            </span>
                            <span className="short-input">
                                <label >CLOSED DATE</label>
                                <input disabled={this.state.isDisable} value={this.state.closed_date} type="date" name="preregistration_start_date" onChange={event=>this.handleClosedDateOnChange(event)}/>
                            </span>
                        </div>
                    </div>
                    <span className="file-upload">
                        <label >COVER PHOTO</label>
                        <input disabled={this.state.isDisable} className="hidden" ref={this.imageUploadInput} type="file" accept="image/*" onChange={event=>this.handleImageOnChange(event)}/>
                        <img ref={this.imageDisplay} alt="" src="data:," name="image" onClick={this.handleImageOnClick}/>
                    </span>
                    <input className={(this.state.isDisable)?"hidden":""}type="submit" value="Save" id="create-button"/>
                </form>
            </React.Fragment>
        )
    }
}

export default ViewPartTimeJobDetails;