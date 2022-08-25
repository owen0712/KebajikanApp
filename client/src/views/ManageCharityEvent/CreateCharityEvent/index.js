import React, { useRef, useState } from 'react'
import './create_charity_event.css';
import BackSection from '../../../components/BackSection';
import { useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const CreateCharityEvent = (props) => {

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
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();
    const navigate = useNavigate();
    const user = useUser();

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
        fetch('/charity_event',{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                title,
                purpose,
                description,
                location,
                amount,
                preregister_start_date,
                preregister_end_date,
                donation_start_date,
                donation_end_date,
                document,
                photo,
                user_id:user.id,
                role:user.role
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
                }).then(
                    props.isAdmin?navigate('/manage_charity_event'):navigate('/charity_event/view')
                );
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const handleRedirectBackAdmin = () => {
        navigate('/manage_charity_event');
    }

    const handleRedirectBackUser = () => {
        navigate('/charity_event/view');
    }
        
    return (
        <React.Fragment>
            {user==null?<Navigate to="/login"/>:<></>}
            <BackSection onBackButtonClick={props.isAdmin?handleRedirectBackAdmin:handleRedirectBackUser} title="Create Charity Event"/>
            <form onSubmit={event=>handleSubmit(event)}>
                <div id="create-form-upper-part">
                    <div id="form-left-content">
                        <span className="short-input">
                            <label >TITLE</label>
                            <input type="text" name="title" onChange={event=>handleTitleOnChange(event)}/>
                        </span>
                        <span className="long-input">
                            <label >PURPOSE</label>
                            <textarea name="purpose" onChange={event=>handlePurposeOnChange(event)}/>
                        </span>
                        <span className="long-input">
                            <label >DESCRIPTION</label>
                            <textarea name="description" onChange={event=>handleDescriptionOnChange(event)}/>
                        </span>
                    </div>
                    <div id="form-right-content">
                        <span className="short-input">
                            <label >LOCATION</label>
                            <input type="text" name="location" onChange={event=>handleLocationOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >TARGET AMOUNT(RM)</label>
                            <input type="number" name="amount" min="0" defaultValue={0} onChange={event=>handleAmountOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >PREREGISTRATION START DATE</label>
                            <input type="date" name="preregistration_start_date" onChange={event=>handlePreregistrationStartDateOnChange(event)}/>
                            </span>
                        <span className="short-input">
                            <label >PREREGISTRATION END DATE</label>
                            <input type="date" name="preregistration_end_date" onChange={event=>handlePreregistrationEndDateOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >DONATION START DATE</label>
                            <input type="date" name="donation_start_date" onChange={event=>handleDonationStartDateOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >DONATION END DATE</label>
                            <input type="date" name="donation_end_date" onChange={event=>handleDonationEndDateOnChange(event)}/>
                        </span>
                        <span className="short-input">
                            <label >SUPPORTING DOCUMENT</label>
                            <input className="hidden" ref={fileUploadInput} onChange={event=>handleFileOnChange(event)} type="file" accept=".zip,.rar,.7zip" name="document"/>
                            <input ref={fileTextDisplay} onClick={handleTextInputOnClick} type="text" defaultValue="No file is chosen"/>
                        </span>
                        <p id="file-upload-reminder">* Please upload your charity event proposal together with supporting documents in zip files</p>
                    </div>
                </div>
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)}/>
                    <img ref={imageDisplay} src="data:," name="image" onClick={handleImageOnClick}/>
                </span>
                <input type="submit" value="Create" id="create-button"/>
            </form>
        </React.Fragment>
    )
}


export default CreateCharityEvent;