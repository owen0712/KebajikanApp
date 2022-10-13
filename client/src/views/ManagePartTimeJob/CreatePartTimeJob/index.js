import React, { useRef, useState, useEffect } from 'react'
import {useNavigate, Navigate} from "react-router-dom";
import {BackSection, Loading} from '../../../components';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import './create_part_time_job.css';

const CreatePartTimeJob = (props) => {

    const [isSubmitLoading,setIsSubmitLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [required_student, setRequiredStudent] = useState(0);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [allowance, setAllowance] = useState(0);
    const [closed_date, setClosedDate] = useState(null);
    const [photo, setPhoto] = useState(null);
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const navigate = useNavigate();
    const user = useUser();

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const handleTitleOnChange = (event) =>{
        setTitle(event.target.value);
    }

    const handleRequiredStudentOnChange = (event) =>{
        setRequiredStudent(event.target.value);
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

    const handleSubmit = (event) =>{
        event.preventDefault();
        setIsSubmitLoading(true);
        fetch('/part_time_job',{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                title,
                required_student,
                description,
                location,
                allowance,
                closed_date,
                photo,
                user_id:user.id,
                role:user.role
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
                navigatePrev();
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const navigatePrev = () =>{
        if(props.isAdmin)
            navigate('/manage_part_time_job');
        else
            navigate('/part_time_job/view');
    }

    return (
        <React.Fragment>
            {isSubmitLoading?<Loading/>:<></>}
            <BackSection title={(props.isAdmin)?"Create Part-Time Job":"Propose Part-Time Job"} onBackButtonClick={navigatePrev}/> 
            <form onSubmit={event=>handleSubmit(event)}>
                <div id="upper-part">
                    <div id="form-left-content">
                        <span className="short-input">
                            <label >TITLE</label>
                            <input type="text" name="title" onChange={event=>handleTitleOnChange(event)}/>
                        </span>
                        <span className="long-input">
                            <label >DESCRIPTION</label>
                            <textarea name="description" onChange={event=>handleDescriptionOnChange(event)}/>
                        </span>
                    </div>
                    <div id="form-right-content">
                        <span className="short-input">
                            <label >REQUIRED STUDENT</label>
                            <input type="number" name="amount" min="0" defaultValue={0} onChange={event=>handleRequiredStudentOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >LOCATION</label>
                            <input type="text" name="location" onChange={event=>handleLocationOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >ALLOWANCE (RM)</label>
                            <input type="number" name="amount" min="0" defaultValue={0} onChange={event=>handleAllowanceOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >CLOSED DATE</label>
                            <input type="date" name="preregistration_start_date" onChange={event=>handleClosedDateOnChange(event)}/>
                        </span>
                    </div>
                </div>
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)}/>
                    <img ref={imageDisplay} alt="" src="data:," name="image" onClick={handleImageOnClick}/>
                </span>
                <input type="submit" value="Create" id="create-button"/>
            </form>
        </React.Fragment>
    )
}

export default CreatePartTimeJob;