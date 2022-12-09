import React, { useRef, useEffect, useState } from 'react'
import {useNavigate, useParams, Navigate} from "react-router-dom";
import {BackSection, Loading} from '../../../components';
import './view_user_job_proposal.css';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const ViewUserJobProposal = (props) => {
    
    const [isLoading,setIsLoading] = useState(true);
    const [isSubmitLoading,setIsSubmitLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [required_student, setRequiredStudent] = useState(0);
    const [allocated_student, setAllocatedStudent] = useState([]);
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [allowance, setAllowance] = useState(0);
    const [closed_date, setClosedDate] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [created_by, setCreatedBy] = useState("");
    const [status, setStatus] = useState("");
    const [isVerify, setIsVerify] = useState(props.isVerify);
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const navigate = useNavigate();
    const {id}  = useParams();
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
                if(created_by && user.id!==created_by){
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
    },[user, created_by])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/part_time_job/'+id,{
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
                setTitle(event.title);
                setRequiredStudent(event.required_student);
                setAllocatedStudent(event.allocated_student);
                setDescription(event.description);
                setLocation(event.location);
                setAllowance(event.allowance);
                setClosedDate(event.closed_date.slice(0,10));
                setPhoto(event.photo);
                setCreatedBy(event.created_by);
                setStatus(event.status)
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
        
    }

    const toggleApprove = (event) =>{
        event.preventDefault();
        updateStatus("Approved");
        updateUserAsPartTimeJobOrganizer();
    }

    const toggleReject = (event) =>{
        event.preventDefault();
        updateStatus("Rejected");
    }

    const updateStatus = (decision) =>{
        setIsSubmitLoading(true);
        const newStatus = ( decision == "Approved")?"Available":decision;
        Swal.fire({
            title: decision+' Job Proposal Application',
            text: 'Do you want to '+decision.toLowerCase()+' this application?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                fetch('/proposed_part_time_job/status/'+id,{
                    method:'put',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':'Bearer'+user.access_token
                    },
                    body:JSON.stringify({
                        status : newStatus,
                        verified_by: user.id,
                        verified_on: Date()
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
                            title: 'Successfully '+decision+'!',
                            confirmButtonText: 'OK'
                        });
                    }
                    toggleViewOnly();
                }).catch(err=>{
                    console.log(err);
                })
            }
        })
        toggleViewOnly();
        setIsSubmitLoading(false);
    }


    const updateUserAsPartTimeJobOrganizer = () => {
        fetch('/user/part_time_job_organizer/'+ created_by,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                part_time_job_organizer:true,
                role:"Organizer"
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

    const handleImageOnClick = () =>{
        imageUploadInput.current.click();
    }

    const navigatePrev = () =>{
        navigate('/manage_user_application');
    }

    const resetState = () => {
        fetchData();
    };

    const toggleVerify = () => {
        setIsVerify(true);
    }

    const toggleViewOnly = () => {
        setIsVerify(false);
        resetState();
    }

    return (
        <React.Fragment>
            {isSubmitLoading?<Loading/>:<></>}
            {isLoading?<Loading/>:<>
            <BackSection title={isVerify?"Verify Part-Time Job Proposal":"View Part-Time Job Proposal"} onBackButtonClick={navigatePrev}/> 
            <form id="view-user-job-proposal">
                <div id="upper-part">
                    <div id="form-left-content">
                        <span className="short-input">
                            <label >TITLE</label>
                            <input disabled value={title} type="text" name="title"/>
                        </span>
                        <span className="long-input">
                            <label >DESCRIPTION</label>
                            <textarea disabled value={description} name="description"/>
                        </span>
                    </div>
                    <div id="form-right-content">
                        <span className="short-input">
                            <label >REQUIRED STUDENT</label>
                            <input disabled value={required_student} type="number" name="required_student"/>
                        </span>
                        <span className="short-input">
                            <label >LOCATION</label>
                            <input disabled value={location} type="text" name="location"/>
                        </span>
                        <span className="short-input">
                            <label >ALLOWANCE (RM)</label>
                            <input disabled value={allowance} type="number" name="amount"/>
                        </span>
                        <span className="short-input">
                            <label >CLOSED DATE</label>
                            <input disabled value={closed_date} type="date" name="closed_date"/>
                        </span>
                    </div>
                </div>
                <span className="full-input">
                    <label >STATUS</label>
                    <input disabled type="text" name="status" defaultValue={status} />
                </span>
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input disabled className="hidden" ref={imageUploadInput} type="file" accept="image/*" />
                    <img ref={imageDisplay} alt="" src={photo.content} name="image" onClick={handleImageOnClick}/>
                </span>
                    {isVerify?
                    <div id="verify-section">
                        <button onClick={toggleApprove} id="approve-button">Approve</button>
                        <button onClick={toggleReject} id="reject-button">Reject</button>
                        <button onClick={toggleViewOnly} id="cancel-button">Cancel</button>
                    </div>:
                    <button disabled={(status!="Pending")} onClick={(status!="Pending")?()=>{}:toggleVerify} id="verify-button">Verify</button>}
            </form>
            </>}
        </React.Fragment>
    )
}

export default ViewUserJobProposal;