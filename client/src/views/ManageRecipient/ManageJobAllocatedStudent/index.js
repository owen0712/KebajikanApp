import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './manage_job_allocated_student.css';
import Swal from 'sweetalert2';
import { BackSection, Loading, Dropdown } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import Modal from '@mui/material/Modal';
import OpenInFull from '@mui/icons-material/OpenInFull';


const statusOption = [
    {label:"Not Active", value:"Approved"},
    {label:"Active", value:"Active"},
    {label:"Paid", value:"Paid"},
];

const ManageJobAllocatedStudent = (props) => {

    const [isLoading,setIsLoading] = useState(true);
    const [jobApplication, setJobApplication] = useState("");
    const [status, setStatus] = useState("");
    const [evidence, setEvidence] = useState(null);
    const [isEdit,setIsEdit] = useState(props.isEdit);
    const [isPreviewPdf,setIsPreviewPdf] = useState(false);
    const {id} = useParams();;
    const navigate = useNavigate();
    const user = useUser();
    const evidenceUploadInput = useRef();
    const evidenceDisplay = useRef();

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
                navigate('/login');
            }
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

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
                const application = data.event;
                setJobApplication(application)
                setStatus(application.status);
                setEvidence(application.evidence);
                setIsLoading(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        setIsLoading(true);
        fetch('/job_application/allocated_student/status/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                status,
                evidence
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else{
                Swal.fire({
                    icon:"success",
                    title:data.message,
                    confirmButtonText: 'Ok'
                });
                setIsLoading(false)
                toggleViewOnly();
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
        toggleViewOnly();
    }

    const handleStatusOnChange = (event) => {
        setStatus(event.target.value);
    }

    const handleTextInputOnClick = () => {
        evidenceUploadInput.current.click();
    }

    const onDownloadEvidence = () => {
        const linkSource = evidence.content;
        const downloadLink = document.createElement("a");
        const fileName = evidence.name;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    const handleEvidenceOnChange = (event) => {
        const setEvidenceUploaded=(evidenceUploaded)=>{
            setEvidence(evidenceUploaded);
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
            setEvidenceUploaded({
                name:event.target.files[0].name,
                content:reader.result
            });
        }
        reader.onerror = function (error) {
            Swal.fire({
                title: error,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        };
        evidenceDisplay.current.value = event.target.files[0].name;
    }

    const navigatePrev = () =>{
        navigate('/manage_part_time_job/view/'+jobApplication.job_id._id);
    }

    const handleClosePreviewPdf = () => {
        setIsPreviewPdf(false);
    }


    const handleOpenPreviewPdf = () => {
        setIsPreviewPdf(true);
    }

    const toggleEdit = () => {
        setIsEdit(true);
    }

    const toggleViewOnly = () => {
        setIsEdit(false);
        resetState();
    }

    const resetState = () => {
        fetchData();
    };

        
    return (
        <React.Fragment>
            <BackSection onBackButtonClick={navigatePrev} title={isEdit?`Edit Allocated Student`:`View Allocated Student`}/>
            {isLoading?<Loading/>:<>
            <form id='manage-job-allocated-student-form' onSubmit={handleSubmit}>
                <span className="short-input">
                    <label >NAME</label>
                    <input disabled defaultValue={jobApplication.name} type="text" name="name" />
                </span>
                <span className="short-input">
                    <label >EMAIL</label>
                    <input disabled defaultValue={jobApplication.email} type="email" name="email" />
                </span>
                <span className="short-input">
                    <label >ID_NO</label>
                    <input disabled defaultValue={jobApplication.identity_no} type="text" name="identity_no" />
                </span>
                <span className="short-input">
                    <label >Course</label>
                    <input disabled defaultValue={jobApplication.course} type="text" name="Course" />
                </span>
                <span className="short-input">
                    <label >APPROVED ON</label>
                    <input disabled type="text" name="status" defaultValue={jobApplication.verified_on.slice(0,10)} />
                </span>
                <Dropdown 
                    optionList={statusOption}
                    label = "STATUS"
                    value = {status}
                    handleOnChange = {handleStatusOnChange}
                    inputClassName = "short-input"
                    styling = {{width:"80%",margin:"auto"}}
                    isDisabled={!isEdit || (evidence&&status=="Paid")}
                    />
                {(status=="Paid")&&<>
                    <span className="short-input">
                        <label>EVIDENCE</label>
                        <input className="hidden" ref={evidenceUploadInput} onChange={event=>handleEvidenceOnChange(event)} type="file" accept=".pdf*" name="document"/>
                        <input className={isEdit?"":"read-only"} ref={evidenceDisplay} onClick={isEdit?handleTextInputOnClick:onDownloadEvidence} type="text" value={evidence&&evidence.name?evidence.name:isEdit?"No file is chosen":"-"} readOnly={!isEdit}/>
                    </span>
                    {(isEdit)&&<p id="file-upload-reminder">* Please upload the evidence as a proof of receiving donated items</p>}
                </>}
                <span className="file-upload">
                    <label className='resume-preview-label'>CURRICULUM VITAE PREVIEW - {jobApplication.document.name}<OpenInFull onClick={handleOpenPreviewPdf} /></label>
                    <div className='resume-preview-frame'>
                        <iframe className='resume-preview' src={jobApplication.document.content}></iframe>
                    </div>
                </span>
                
                {isEdit?<div id="save-section">
                <button onClick={toggleViewOnly} id="cancel-button">Cancel</button>
                <input type="submit" value="Save" id="create-button"/>
                </div>:
                <button onClick={toggleEdit} id="create-button">Edit</button>
                }
            </form>
            <div id='pdf-modal'>
                <Modal
                    open={isPreviewPdf}
                    onClose={handleClosePreviewPdf}
                >
                    <div className='resume-preview-box'>
                        <h2 className='resume-full-preview-title'>
                            {jobApplication.document.name}
                        </h2>
                        <div className='resume-full-preview-frame'>
                            <iframe className='resume-preview' src={jobApplication.document.content}></iframe>
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


export default ManageJobAllocatedStudent;