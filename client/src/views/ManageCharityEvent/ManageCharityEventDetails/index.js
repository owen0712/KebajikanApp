import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './manage_charity_event_details.css';
import BackSection from '../../../components/BackSection';

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
    const [receipients,setReceipients] = useState([]);
    const [isEdit,setIsEdit] = useState(props.isEdit);
    const imageUploadInput = useRef();
    const imageDisplay = useRef();
    const fileUploadInput = useRef();
    const fileTextDisplay = useRef();
    const {id} = useParams();;
    const navigate = useNavigate();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/charity_event/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
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
                setReceipients(event.receipient);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
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
        fetch('/charity_event/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json'
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
                receipients
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log(data.message);
                setIsEdit(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const toggleEdit = () => {
        setIsEdit(true);
        console.log(isEdit);
    }

    const handleRedirectBack = () => {
        navigate('/manage_charity_event');
    }
        
    return (
        <React.Fragment>
            {isLoading?<p>Loading...</p>:<>
            <BackSection onBackButtonClick={handleRedirectBack} title={isEdit?"Edit Charity Event":"View Charity Event"}/>
            <form onSubmit={handleSubmit}>
                <div id="create-form-upper-part">
                    <div id="form-left-content">
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
                    <div id="form-right-content">
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
                            <input ref={fileTextDisplay} onClick={isEdit?handleTextInputOnClick:()=>{}} type="text" defaultValue={document.name} disabled={!isEdit}/>
                        </span>
                        <p id="file-upload-reminder">* Please upload your charity event proposal together with supporting documents in zip files</p>
                    </div>
                </div>
                <span className="file-upload">
                    <label >COVER PHOTO</label>
                    <input className="hidden" ref={imageUploadInput} type="file" accept="image/*" onChange={event=>handleImageOnChange(event)}/>
                    <img ref={imageDisplay} src={photo.content} name="image" onClick={isEdit?handleImageOnClick:()=>{}}/>
                </span>
                {/* <div id="#charity-event-list-table-section">
                    <table>
                        <thead>
                            <tr>
                                <th>STUDENT'S NAME</th>
                                <th>DATE APPROVED</th>
                                <th>STATUS</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            receipients.map(recepient=>{
                                return <tr key={recepient._id}>
                                    <td>{event.title}</td>
                                    <td>{event.organizer_id.name}</td>
                                    <td>RM{event.current_amount}/{event.amount}</td>
                                    <td>{event.created_on}</td>
                                    <td>{event.status}</td>
                                    <td className='button-list'>
                                        <button className='button'><RemoveRedEyeIcon/>View</button>
                                        <button className='button'><CreateIcon/>Edit</button>
                                        <button className='danger-button'><DeleteIcon/>Delete</button>    
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div> */}
                {isEdit?<input type="submit" value="Save" id="create-button"/>:<button onClick={toggleEdit} id="create-button">Edit</button>}
            </form>
            </>}
        </React.Fragment>
        )
    }


export default ManageCharityEventDetails;