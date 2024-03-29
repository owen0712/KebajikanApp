import React, { useRef, useEffect, useState } from 'react'
import {useNavigate, useParams, Navigate} from "react-router-dom";
import {BackSection, Loading} from '../../../components';
import './manage_part_time_job_details.css';
import AllocatedStudentList from './AllocatedStudentList';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const ManagePartTimeJobDetails = (props) => {
    
    const [isLoading,setIsLoading] = useState(true);
    const [isSubmitLoading,setIsSubmitLoading] = useState(false);
    const [job, setJob] = useState(null);
    const [title, setTitle] = useState("");
    const [required_student, setRequiredStudent] = useState(0);
    const [allocated_student, setAllocatedStudent] = useState([]);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [allowance, setAllowance] = useState(0);
    const [closed_date, setClosedDate] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [createdBy, setCreatedBy] = useState("");
    const [isEdit, setIsEdit] = useState(props.isEdit);
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const navigate = useNavigate();
    const job_id  = useParams();
    const user = useUser();

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            fetchData();
            if(user.role==2){
                fetchData();
            }
            else{
                if(createdBy && user.id!==createdBy){
                    Swal.fire({
                        title: "Unauthorized access, you are redirected to home page",
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                    navigate('/login');
                }
            }
        }
        return () => {
            clearTimeout(timer);
        }
    },[user, createdBy])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/part_time_job/'+job_id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                const event = data.event;
                setJob(event);
                setTitle(event.title);
                setRequiredStudent(event.required_student);
                setAllocatedStudent(event.allocated_student);
                setDescription(event.description);
                setLocation(event.location);
                setAllowance(event.allowance);
                setClosedDate(event.closed_date.slice(0,10));
                setPhoto(event.photo);
                setCreatedBy(event.created_by);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
        
    }

    const handleTitleOnChange = (event) =>{
        setTitle(event.target.value);
    }

    const handleRequiredStudentOnChange = (event) =>{
        if (event.target.value>=0)
            setRequiredStudent(event.target.value);
        else{
            setRequiredStudent(0);
            event.target.value="";
        }
    }

    const handleDescriptionOnChange = (event) =>{
        setDescription(event.target.value);
    }

    const handleLocationOnChange = (event) =>{
        setLocation(event.target.value);
    }

    const handleAllowanceOnChange = (event) =>{
        if (event.target.value>=0)
            setAllowance(event.target.value);
        else{
            setAllowance(0);
            event.target.value="";
        }
    }
    
    const handleClosedDateOnChange = (event) =>{
        setClosedDate(event.target.value);
    }

    const handleImageOnClick = () =>{
        imageUploadInput.current.click();
    }

    const handleImageOnChange = (event) =>{
        const setPhotoUploaded=(photoUploaded)=>{
            setPhoto(photoUploaded);
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
        imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    const handleSave = (event) =>{
        event.preventDefault();
        setIsSubmitLoading(true);
        if(new Date(closed_date)<new Date(job.created_on)){
            Swal.fire({
                title: "Closed Date must be after the date of this job created ("+job.created_on.slice(0,10)+")",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            setIsSubmitLoading(false);
            return;
        }
        fetch('/part_time_job/'+job_id.id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                title,
                required_student,
                allocated_student,
                description,
                location,
                allowance,
                closed_date,
                photo
            })
        }).then(res=>res.json()).then(data=>{
            setIsSubmitLoading(false);
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else{
                Swal.fire({
                    icon: 'success',
                    title: data.message,
                    confirmButtonText: 'OK'
                });
                if(required_student<=allocated_student.length){
                    updateAllJobApplicationToClosed(job_id.id)
                }
                setIsEdit(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const updateAllJobApplicationToClosed = (id) => {
        fetch('/job_application/job_closed/rejected/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
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


    const navigatePrev = () =>{
        if(props.isAdmin)
            navigate('/manage_part_time_job');
        else
            navigate('/profile/application_history');
    }

    const resetState = () => {
        fetchData();
    };

    const toggleEdit = () => {
        setIsEdit(true);
    }

    const toggleCancel = () => {
        setIsEdit(false);
        resetState();
    }

    return (
        <React.Fragment>
            {isSubmitLoading?<Loading/>:<></>}
            {isLoading?<Loading/>:<>
            <BackSection title={isEdit?"Edit Part-Time Job Details":"View Part-Time Job Details"} onBackButtonClick={navigatePrev}/> 
            <form onSubmit={event=>handleSave(event)}>
                <div id="upper-part">
                    <div id="job-form-left-content">
                        <span className="short-input">
                            <label >TITLE</label>
                            <input disabled={!isEdit} value={title} type="text" name="title" onChange={event=>handleTitleOnChange(event)}/>
                        </span>
                        <span className="long-input">
                            <label >DESCRIPTION</label>
                            <textarea disabled={!isEdit} value={description} name="description" onChange={event=>handleDescriptionOnChange(event)}/>
                        </span>
                    </div>
                    <div id="job-form-right-content">
                        <span className="short-input">
                            <label >REQUIRED STUDENT</label>
                            <input disabled={!isEdit} value={required_student} min={allocated_student.length==0?"1":allocated_student.length} type="number" name="amount" onChange={event=>handleRequiredStudentOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >LOCATION</label>
                            <input disabled={!isEdit} value={location} type="text" name="location" onChange={event=>handleLocationOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >ALLOWANCE (RM)</label>
                            <input disabled={!isEdit} value={allowance} min="1" type="number" name="amount" onChange={event=>handleAllowanceOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >CLOSED DATE</label>
                            <input disabled={!isEdit} value={closed_date} type="date" name="preregistration_start_date" onChange={event=>handleClosedDateOnChange(event)}/>
                        </span>
                    </div>
                </div>
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input disabled={!isEdit} className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)}/>
                    <img ref={imageDisplay} alt="" src={photo.content} name="image" onClick={handleImageOnClick}/>
                </span>
                {allocated_student.length>0&&<AllocatedStudentList isEdit={isEdit} allocated_student={allocated_student} setAllocatedStudent={setAllocatedStudent}/>}
                {isEdit?<div id="save-section"><button onClick={toggleCancel} id="cancel-button">Cancel</button><input type="submit" value="Save" id="save-button"/></div>:<button onClick={toggleEdit} id="create-button">Edit</button>}
            </form>
            </>}
        </React.Fragment>
    )
}

export default ManagePartTimeJobDetails;