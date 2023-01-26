import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import './manage_charity_event_details.css';
import BackSection from '../../../components/BackSection';
import Swal from 'sweetalert2';
import { Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import RecipientList from './RecipientList';

const ManageCharityEventDetails = (props) => {

    const [isLoading,setIsLoading] = useState(true);
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
    const [createdBy, setCreatedBy] = useState("");
    const [recipients,setRecipients] = useState([]);
    const [isEdit,setIsEdit] = useState(props.isEdit);
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

    const handleTitleOnChange = (event) => {
        setTitle(event.target.value);
    }

    const handlePurposeOnChange = (event) =>{
        setPurpose(event.target.value);
    }

    const handleDescriptionOnChange = (event) => {
        setDescription(event.target.value);
    }

    const handleLocationOnChange = (event) =>{
        setLocation(event.target.value);
    }

    const handleAmountOnChange = (event) => {
        setAmount(event.target.value);
    }
    
    const handlePreregistrationStartDateOnChange = (event) => {
        setPreregisterStartDate(event.target.value);
    }
    
    const handlePreregistrationEndDateOnChange = (event) => {
        setPreregisterEndDate(event.target.value);
    }

    const handleDonationStartDateOnChange = (event) => {
        setDonationStartDate(event.target.value);
    }

    const handleDonationEndDateOnChange = (event) => {
        setDonationEndDate(event.target.value);
    }

    const handleTextInputOnClick = () => {
        if(!isEdit){
            handleViewFile();
            setDocument(prev=>({...prev,name:document.name}));
            return;
        }
        fileUploadInput.current.click();
    }

    const handleFileOnChange = (event) => {
        const setDocumentUploaded = (documentUploaded) =>{
            setDocument(documentUploaded);
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
        fileTextDisplay.current.value = event.target.files[0].name;
    }

    const handleImageOnClick = () => {
        imageUploadInput.current.click();
    }

    const handleImageOnChange = (event) => {
        const setPhotoUploaded=(photoUploaded)=>{
            setPhoto(photoUploaded);
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
        imageDisplay.current.src = URL.createObjectURL(event.target.files[0]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(preregister_end_date<preregister_start_date){
            Swal.fire({
                title: "Preregister End Date must greater than Preregister Start Date",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        if(donation_start_date<preregister_end_date){
            Swal.fire({
                title: "Donation Start Date must greater than Preregister End Date",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        if(donation_end_date<donation_start_date){
            Swal.fire({
                title: "Donation End Date must greater than Donation Start Date",
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
        var request_body = {
            title,
            purpose,
            description,
            location,
            amount,
            preregister_start_date,
            preregister_end_date,
            donation_start_date,
            donation_end_date,
            photo,
            recipients
        };
        if(document&&document?.content){
            request_body = {...request_body, document}
        }
        fetch('/charity_event/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                ...request_body
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
                setDocument({name:document.name});
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

    const toggleEdit = () => {
        setIsEdit(true);
    }

    const handleRedirectBack = () => {
        if(props.isAdmin)
            navigate('/manage_charity_event');
        else
            navigate('/profile/application_history');
    }

    const toggleCancel = () => {
        setIsEdit(false);
        resetState();
    }

    const resetState = () => {
        fetchData();
    };

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
            <BackSection onBackButtonClick={handleRedirectBack} title={isEdit?"Edit Charity Event":"View Charity Event"}/>
            {isLoading?<Loading/>:<>
            <form onSubmit={handleSubmit}>
                <div id="create-form-upper-part">
                    <div id="charity-form-left-content">
                        <span className="short-input">
                            <label >TITLE</label>
                            <input type="text" name="title" defaultValue={title} onChange={event=>handleTitleOnChange(event)} disabled={!isEdit} />
                        </span>
                        <span className="long-input">
                            <label >PURPOSE</label>
                            <textarea name="purpose" defaultValue={purpose} onChange={event=>handlePurposeOnChange(event)} disabled={!isEdit} />
                        </span>
                        <span className="long-input">
                            <label >DESCRIPTION</label>
                            <textarea name="description" defaultValue={description} onChange={event=>handleDescriptionOnChange(event)} disabled={!isEdit} />
                        </span>
                    </div>
                    <div id="charity-form-right-content">
                        <span className="short-input">
                            <label >LOCATION</label>
                            <input type="text" name="location" defaultValue={location} onChange={event=>handleLocationOnChange(event)} disabled={!isEdit} />
                        </span>
                        <span className="short-input">
                            <label >TARGET AMOUNT(RM)</label>
                            <input type="number" name="amount" min="0" defaultValue={amount} onChange={event=>handleAmountOnChange(event)} disabled={!isEdit} />
                        </span>
                        <span className="short-input">
                            <label >PREREGISTRATION START DATE</label>
                            <input type="date" name="preregistration_start_date" defaultValue={preregister_start_date} onChange={event=>handlePreregistrationStartDateOnChange(event)}  disabled={!isEdit} />
                            </span>
                        <span className="short-input">
                            <label >PREREGISTRATION END DATE</label>
                            <input type="date" name="preregistration_end_date" defaultValue={preregister_end_date} onChange={event=>handlePreregistrationEndDateOnChange(event)}  disabled={!isEdit} />
                        </span>
                        <span className="short-input">
                            <label >DONATION START DATE</label>
                            <input type="date" name="donation_start_date" defaultValue={donation_start_date} onChange={event=>handleDonationStartDateOnChange(event)}  disabled={!isEdit} />
                        </span>
                        <span className="short-input">
                            <label >DONATION END DATE</label>
                            <input type="date" name="donation_end_date" defaultValue={donation_end_date} onChange={event=>handleDonationEndDateOnChange(event)}  disabled={!isEdit} />
                        </span>
                        <span className="short-input">
                            <label >SUPPORTING DOCUMENT</label>
                            <input className="hidden" ref={fileUploadInput} onChange={event=>handleFileOnChange(event)} type="file" accept=".zip,.rar,.7zip" name="document"/>
                            {isEdit?"":
                            <iframe className="hidden" src={document.content} title={document.name}></iframe>
                            }
                            <input className={isEdit?"":"read-only"} ref={fileTextDisplay} onClick={handleTextInputOnClick} type="text" defaultValue={document.name} readOnly={!isEdit}/>
                        </span>
                        <p id="file-upload-reminder">* Please upload your charity event proposal together with supporting documents in zip files</p>
                    </div>
                </div>
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)}/>
                    <img ref={imageDisplay} src={photo.content} name="image" onClick={isEdit?handleImageOnClick:()=>{}}/>
                </span>
                {recipients.length>0&&<RecipientList isEdit={isEdit} recipients={recipients} setRecipients={setRecipients}/>}
                {isEdit?<div id="save-section">
                <button onClick={toggleCancel} id="cancel-button">Cancel</button>
                <input type="submit" value="Save" id="create-button"/>
                </div>:
                <button onClick={toggleEdit} id="create-button">Edit</button>
                }
            </form>
            </>}
        </React.Fragment>
        )
    }


export default ManageCharityEventDetails;