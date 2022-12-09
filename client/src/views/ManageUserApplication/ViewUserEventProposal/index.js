import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import './view_user_event_proposal.css';
import BackSection from '../../../components/BackSection';
import Swal from 'sweetalert2';
import { Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ViewUserEventProposal = (props) => {

    const [isLoading,setIsLoading] = useState(true);
    const [isSubmitLoading,setIsSubmitLoading] = useState(false);
    const [title,setTitle] = useState("");
    const [purpose,setPurpose] = useState("");
    const [description,setDescription] = useState("");
    const [location,setLocation] = useState("");
    const [amount,setAmount] = useState(0);
    const [preregister_start_date,setPreregisterStartDate] = useState(null);
    const [preregister_end_date,setPreregisterEndDate] = useState(null);
    const [donation_start_date,setDonationStartDate] = useState(null);
    const [donation_end_date,setDonationEndDate] = useState(null);
    const [document,setDocument] = useState(null);
    const [photo,setPhoto] = useState(null);
    const [created_by, setCreatedBy] = useState("");
    const [status, setStatus] = useState("");
    const [recipients,setRecipients] = useState([]);
    const [isVerify,setIsVerify] = useState(props.isVerify);
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();
    const {id} = useParams();;
    const navigate = useNavigate();
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

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/charity_event/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log("Error",data.error)
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else{
                const event = data.event;
                setTitle(event.title);
                setPurpose(event.purpose);
                setDescription(event.description);
                setLocation(event.location);
                setAmount(event.amount);
                setPreregisterStartDate(event.preregister_start_date.slice(0, 10));
                setPreregisterEndDate(event.preregister_end_date.slice(0, 10));
                setDonationStartDate(event.donation_start_date.slice(0, 10));
                setDonationEndDate(event.donation_end_date.slice(0, 10));
                setDocument(event.document);
                setPhoto(event.photo);
                setCreatedBy(event.created_by);
                setStatus(event.status);
                setRecipients(event.recipients);
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

    const toggleApprove = (event) =>{
        event.preventDefault();
        updateStatus("Approved");
        updateUserAsCharityEventOrganizer();
    }

    const toggleReject = (event) =>{
        event.preventDefault();
        updateStatus("Rejected");
    }

    const updateStatus = (decision) =>{
        setIsSubmitLoading(true);
        const newStatus = ( decision == "Approved")?"Not Started":decision;
        Swal.fire({
            title: decision+' Event Proposal Application',
            text: 'Do you want to '+decision.toLowerCase()+' this application?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                fetch('/proposed_charity_event/status/'+id,{
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


    const updateUserAsCharityEventOrganizer = () => {
        fetch('/user/charity_event_organizer/'+ created_by,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            },
            body:JSON.stringify({
                charity_event_organizer:true,
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

    const handleTextInputOnClick = () => {
        handleViewFile();
        setDocument(prev=>({...prev,name:document.name}));
        return;
        // fileUploadInput.current.click();
    }

    const handleImageOnClick = () => {
        imageUploadInput.current.click();
    }

    const handleRedirectBack = () => {
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

    const handleViewFile = () => {
        fetch('/charity_event/document/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer'+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else{
                setDocument(data.document);
                console.log(data.document)
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }
        
    return (
        <React.Fragment>
            <BackSection onBackButtonClick={handleRedirectBack} title={isVerify?"Verify Charity Event Proposal":"View Charity Event Proposal"}/>
            {isLoading?<Loading/>:<>
            <form id="view-user-event-proposal">
                <div id="create-form-upper-part">
                    <div id="form-left-content">
                        <span className="short-input">
                            <label >TITLE</label>
                            <input type="text" name="title" defaultValue={title} disabled />
                        </span>
                        <span className="long-input">
                            <label >PURPOSE</label>
                            <textarea name="purpose" defaultValue={purpose} disabled />
                        </span>
                        <span className="long-input">
                            <label >DESCRIPTION</label>
                            <textarea name="description" defaultValue={description} disabled />
                        </span>
                    </div>
                    <div id="form-right-content">
                        <span className="short-input">
                            <label >LOCATION</label>
                            <input type="text" name="location" defaultValue={location} disabled />
                        </span>
                        <span className="short-input">
                            <label >TARGET AMOUNT(RM)</label>
                            <input type="number" name="amount" min="0" defaultValue={amount} disabled />
                        </span>
                        <span className="short-input">
                            <label >PREREGISTRATION START DATE</label>
                            <input type="date" name="preregistration_start_date" defaultValue={preregister_start_date} disabled/>
                            </span>
                        <span className="short-input">
                            <label >PREREGISTRATION END DATE</label>
                            <input type="date" name="preregistration_end_date" defaultValue={preregister_end_date} disabled />
                        </span>
                        <span className="short-input">
                            <label >DONATION START DATE</label>
                            <input type="date" name="donation_start_date" defaultValue={donation_start_date} disabled />
                        </span>
                        <span className="short-input">
                            <label >DONATION END DATE</label>
                            <input type="date" name="donation_end_date" defaultValue={donation_end_date} disabled />
                        </span>
                        <span className="short-input">
                            <label >SUPPORTING DOCUMENT</label>
                            <input className="hidden" ref={fileUploadInput} disabled type="file" accept=".zip,.rar,.7zip" name="document"/>
                            
                            <iframe className="hidden" src={document.content} title={document.name}></iframe>
                            
                            <input className={"read-only"} ref={fileTextDisplay} onClick={handleTextInputOnClick} type="text" defaultValue={document.name} readOnly={true}/>
                        </span>
                    </div>
                </div>
                <span className="full-input">
                    <label >STATUS</label>
                    <input disabled type="text" name="status" defaultValue={status} />
                </span>
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" disabled/>
                    <img ref={imageDisplay} src={photo.content} name="image" onClick={handleImageOnClick}/>
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


export default ViewUserEventProposal;