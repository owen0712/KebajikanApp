import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './view-user-job-application.css';
import { BackSection, Dropdown, Loading } from '../../../components';
import Swal from 'sweetalert2';
import Modal from '@mui/material/Modal';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useUser } from '../../../contexts/UserContext';
import OpenInFull from '@mui/icons-material/OpenInFull';


const ViewJobApplication = (props) => {

    const [job,setJob] = useState([]); 
    const [jobTitle,setJobTitle] = useState(""); 
    const [isLoading,setIsLoading] = useState(true);
    const [isSubmitLoading,setIsSubmitLoading] = useState(false);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [identity_no, setIdentityNo] = useState("");
    const [created_on, setCreatedOn] = useState("");
    const [created_by, setCreatedBy] = useState("");
    const [document,setDocument] = useState({});
    const [status, setStatus] = useState("");
    const [isVerify,setIsVerify] = useState(props.isVerify);
    const [isPreviewPdf,setIsPreviewPdf] = useState(false);
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();
    const {id} = useParams();
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
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])


    const handleTextInputOnClick = () => {
        fileUploadInput.current.click();
    }
    

    const fetchData = () => {
        setIsLoading(true);
        fetch('/job_application/view/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                const event = data.event;
                setName(event.name);
                setJob(event.job_id);
                setJobTitle(event.job_id.title);
                setEmail(event.email);
                setIdentityNo(event.identity_no);
                setCourse(event.course);
                setCreatedOn(event.created_on);
                setCreatedBy(event.created_by);
                setDocument(event.document);
                setStatus(event.status);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
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

    const toggleApprove = (event) => {
        event.preventDefault();
        setIsSubmitLoading(true);
        const newStatus = (job.allocated_student.length+1 >= job.required_student)?"Closed":"Available";
        fetch('/part_time_job/allocated_student/'+job._id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                student : id,
                status: newStatus
            })
        }).then(res=>res.json()).then(data=>{
            setIsSubmitLoading(false);
            if(data.error){
                console.log(data.error);
            }
            else{
                updateStatus("Approved");
                updateUserAsPartTimeJobRecipient();
                toggleViewOnly();
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const toggleReject = (event) => {
        event.preventDefault();
        Swal.fire({
            title: 'Reject Part-Time Job Application',
            text: 'Do you want to reject this application?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                updateStatus("Rejected");
                toggleViewOnly();
            }
        })
    }

    const updateStatus = (decision) => {
        setIsSubmitLoading(true);
        fetch('/job_application/status/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                status : decision,
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
        }).catch(err=>{
            console.log(err);
        })
    }

    const updateUserAsPartTimeJobRecipient = () => {
        fetch('/user/part_time_job_recipient/'+created_by,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                part_time_job_recipient:true
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

    const toggleViewOnly = () => {
        setIsVerify(false);
        resetState();
    }

    const handleClosePreviewPdf = () => {
        setIsPreviewPdf(false);
    }

    const handleOpenPreviewPdf = () => {
        setIsPreviewPdf(true);
    }
        
    return (
        <React.Fragment>
            <BackSection onBackButtonClick={navigatePrev} title={"View Job Application: "+jobTitle}/>
            {isSubmitLoading?<Loading/>:<></>}
            {isLoading?<Loading/>:<>
            <div id="user-job-application-layout">
                <div id="user-job-application-details-section">
                    <span>
                        <h2 id="application-job-title">{job.title}</h2>
                        <p>Description: {job.description}</p>
                        <p>Allowance: RM{job.allowance}</p>
                        <p>Closed Date: {job.closed_date.slice(0,10)}</p>
                        <p>Application Date: {created_on.slice(0,10)}</p>
                    </span>
                    
                    <span className="long-input">
                        <label className='resume-preview-label'>CURRICULUM VITAE PREVIEW <OpenInFull onClick={handleOpenPreviewPdf} /></label>
                        <div className='resume-preview-frame'>
                            <iframe className='resume-preview' src={document.content}></iframe>
                        </div>
                    </span>
                    
                    
                </div>
                <form id="user-job-application-form">
                    <span className="short-input">
                        <label >NAME</label>
                        <input disabled value={name} type="text" name="name" />
                    </span>
                    <span className="short-input">
                        <label >EMAIL</label>
                        <input disabled value={email} type="email" name="email" />
                    </span>
                    <span className="short-input">
                        <label >ID_NO</label>
                        <input disabled value={identity_no} type="text" name="identity_no" />
                    </span>
                    <span className="short-input">
                        <label >Course</label>
                        <input disabled value={course} type="text" name="Course" />
                    </span>
                    <span className="short-input">
                        <label >CURRICULUM VITAE</label>
                        <input className="hidden" ref={fileUploadInput}  type="file" accept=".pdf" name="document"/>
                        <input disabled ref={fileTextDisplay} onClick={isVerify?handleTextInputOnClick:()=>{}} type="text" defaultValue={document.name}/>
                    </span>
                    <span className="short-input">
                        <label >STATUS</label>
                        <input disabled type="text" name="status" defaultValue={status} />
                    </span>
                    {isVerify?
                    <div id="verify-section">
                        <button onClick={toggleApprove} id="approve-button">Approve</button>
                        <button onClick={toggleReject} id="reject-button">Reject</button>
                        <button onClick={toggleViewOnly} id="cancel-button">Cancel</button>
                    </div>:
                    <button disabled={(status=="Approved" || status=="Rejected")} onClick={(status=="Approved" || status=="Rejected")?()=>{}:toggleVerify} id="verify-button">Verify</button>}
                </form>
            </div>
            <div id='pdf-modal'>
                <Modal
                    open={isPreviewPdf}
                    onClose={handleClosePreviewPdf}
                >
                    <div className='resume-preview-box'>
                        <h2 className='resume-full-preview-title'>
                            {document.name}
                        </h2>
                        <div className='resume-full-preview-frame'>
                            <iframe className='resume-preview' src={document.content}></iframe>
                        </div>
                        <div className='resume-full-preview-action-section'>
                            <button className="modal-close-button" onClick={handleClosePreviewPdf}>Close</button>
                        </div>
                    </div>
                </Modal>
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewJobApplication;