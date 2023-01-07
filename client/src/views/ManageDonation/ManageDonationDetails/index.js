import React, { useRef, useEffect, useState } from 'react'
import './manage_donation_details.css';
import {BackSection, Loading, Dropdown} from '../../../components';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const statusOption = [
    "Verified",
    "Rejected",
    "Not Verified"
];

const ManageDonationDetails = (props) => {

    const [donation,setDonation] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [status,setStatus] = useState("");
    const [evidence,setEvidence] = useState(null);
    const [appointment,setAppointment] = useState(null);
    const [isVerify, setIsVerify] = useState(props.isVerify);
    const {id} = useParams();
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
            if(user.role==2){
                fetchData();
            }
            else{
                timer = setTimeout(()=>{
                    navigate('/login')
                },5000)
            }
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const fetchData = () => {
        fetch('/donation/'+id,{
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
                })
            }
            else{
                setDonation(data.donation);
                setStatus(data.donation.status);
                setEvidence(data.donation.evidence);
                setAppointment(data.donation.appointment_id);
                setIsLoading(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const handleStatusOnChange = (event) => {
        setStatus(event.target.value);
    }

    const handleTextInputOnClick = () => {
        evidenceUploadInput.current.click();
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

    const retrieveReceipt = () => {
        fetch('/receipt/'+id,{
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
                })
            }
            const linkSource = data.receipt.content;
            const downloadLink = document.createElement("a");
            const fileName = data.receipt.name;
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const toggleVerified = () =>{
        setIsLoading(true); 
        fetch('/donation/status/verified/'+id,{
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
            setIsLoading(false);
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
                toggleViewOnly();
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const toggleUpdateStatus = () =>{
        setIsLoading(true); 
        fetch('/donation/status/'+id,{
            method:'put',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                status
            })
        }).then(res=>res.json()).then(data=>{
            setIsLoading(false);
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
                toggleViewOnly();
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
    }

    const toggleUpdateAppointmentStatus = (isApproved) =>{
        setIsLoading(true); 
        const newStatus = isApproved?"Appointment":"Rejected";
        const decision = isApproved?"Approve":"Reject";
        Swal.fire({
            title: decision+' Item Donation Appointment',
            text: 'Do you want to '+decision.toLowerCase()+' this appointment?',
            icon: 'info',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                fetch('/donation/status/'+id,{
                    method:'put',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':"Bearer"+user.access_token
                    },
                    body:JSON.stringify({
                        status: newStatus
                    })
                }).then(res=>res.json()).then(data=>{
                    setIsLoading(false);
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
                        toggleViewOnly();
                    }
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
            }
        })
        toggleViewOnly();
        setIsLoading(false); 
    }
    

    const toggleSave = () =>{
        if(status=="Verified"){
            toggleVerified();
        }else{
            toggleUpdateStatus();
        }
    }

    const handleButtonOnClick = () => {
        retrieveReceipt();
    }

    const handleRedirectBack = () => {
        navigate('/manage_donation');
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
    const renderAppointmentDetails = () => {
        return (
            <>
                <div>
                    <span className="full-input">
                        <label >APPOINTMENT DATE</label>
                        <input disabled type="text" name="date" defaultValue={appointment.date.slice(0,10)}/>
                    </span>
                    <span className="full-input">
                        <label >APPOINTMENT TIME</label>
                        <input disabled type="time" name="time" defaultValue={appointment.time}/>
                    </span>
                    <span className="full-input">
                        <label >APPOINTMENT LOCATION</label>
                        <input disabled type="text" name="location" defaultValue={appointment.location}/>
                    </span>
                    <span className="full-input">
                        <label >NAME</label>
                        <input disabled type="text" name="location" defaultValue={appointment.name}/>
                    </span>
                    <span className="full-input">
                        <label >EMAIL</label>
                        <input disabled type="email" name="location" defaultValue={appointment.email}/>
                    </span>
                    <span className="full-input">
                        <label >PHONE NUMBER</label>
                        <input disabled type="text" name="location" defaultValue={appointment.phone_number}/>
                    </span>
                </div>
                <div className="donation-status-section">
                    <span className="full-input">
                        <label >STATUS</label>
                        <input disabled type="text" name="location" defaultValue={status}/>
                    </span>
                </div>
            </>
        )
    }

    const renderDonationDetails = () => {
        return (
            <>
                <table>
                    <tbody>
                        <tr className='title'>
                            <td colSpan={3}>To: {user.name}</td>
                            <td colSpan={2}>Donation Mode: {donation.category}</td>
                        </tr>
                        <tr>
                            <td colSpan={5}>Title: Donation for "{donation.charity_event_id.title}" Event</td>
                        </tr>
                        <tr className='title'>
                            <td>No</td>
                            <td>Description</td>
                            <td>Amount(RM)</td>
                            <td>Quantity</td>
                            <td>Total Payment</td>
                        </tr>
                        {
                            donation.category=="Money"?
                                <tr>
                                    <td>1</td>
                                    <td>Money</td>
                                    <td>{donation.amount}</td>
                                    <td>-</td>
                                    <td>{donation.amount}</td>
                                </tr>
                            :
                            <>
                            {donation.items.map((item,index)=>{
                                return <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{item.description}</td>
                                    <td>-</td>
                                    <td>{item.quantity}</td>
                                    <td>-</td>
                                </tr>
                            })}
                            </>
                        }
                        <tr>
                            <td className='title' colSpan={4}>Total</td>
                            <td>{donation.category=="Money"?donation.amount:"-"}</td>
                        </tr>
                    </tbody>    
                </table>

                <div className="donation-status-section">
                    <Dropdown 
                        optionList={statusOption}
                        label = "STATUS"
                        value = {status}
                        handleOnChange = {handleStatusOnChange}
                        inputClassName = "full-input"
                        styling = {{width:"80%"}}
                        isDisabled={!isVerify}
                    />
                    {(status=="Verified"||!isVerify)&&
                    <div>
                    <span className="full-input">
                        <label>EVIDENCE</label>
                        <input className="hidden" ref={evidenceUploadInput} onChange={event=>handleEvidenceOnChange(event)} type="file" accept="image/*" name="document"/>
                        <input ref={evidenceDisplay} onClick={handleTextInputOnClick} type="text" defaultValue={evidence.name?evidence.name:isVerify?"No file is chosen":"-"} disabled={!isVerify}/>
                    </span>
                    {(isVerify)&&<p id="file-upload-reminder">* Please upload the evidence as a proof of receiving donated items</p>}
                    </div>
                    }
                </div>
            </>
        )
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection onBackButtonClick={handleRedirectBack} title={(status == "Pending" || status == "Appointment")?"Item Donation Appointment Details":"Donation Details"}/>
            <div id='donation-details-section'>
                
                {(donation.category=="Item" && (status == "Pending" || status == "Appointment"))?
                    renderAppointmentDetails():
                    renderDonationDetails()
                }

                

                {(donation.category=="Item"&&status=="Pending")&&<p id="file-upload-reminder">* Please verify the item donation appointment details.</p>}
                {(donation.category=="Item"&&status=="Appointment")&&<p id="file-upload-reminder">* Waiting for donor to submit item donation form.</p>}
                
                {donation.status=="Verified"&&
                    <div id="donation-button-row">
                        <button className='button' id="donate-button" onClick={handleButtonOnClick}>Generate Receipt</button>
                    </div>
                }

                {(donation.status!="Verified"&&donation.status!="Rejected"&&donation.status!="Appointment")&&
                    <div id="donation-button-row">
                        {isVerify?
                        <div id="save-section">
                            {donation.status=="Pending"?
                            <>
                                <button onClick={()=>toggleUpdateAppointmentStatus(true)} id="approve-button">Approve</button>
                                <button onClick={()=>toggleUpdateAppointmentStatus(false)} id="reject-button">Reject</button>
                            </>:
                            <button onClick={toggleSave} id="save-button">Save</button>
                            }
                            <button onClick={toggleViewOnly} id="cancel-button">Cancel</button>
                        </div>:
                        <button onClick={toggleVerify} id="create-button">Verify</button>}
                    </div>
                }
            </div>
            </>}
        </React.Fragment>
    )
}

export default ManageDonationDetails;