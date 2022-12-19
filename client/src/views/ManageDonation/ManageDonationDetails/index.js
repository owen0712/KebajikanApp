import React, { useRef, useEffect, useState } from 'react'
import './manage_donation_details.css';
import {BackSection, Loading, Dropdown} from '../../../components';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';


const statusOption = [
    "Verified",
    "Not Verified",
    "Pending"
];

const ManageDonationDetails = (props) => {

    const [donation,setDonation] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [status,setStatus] = useState("");
    const [evidence,setEvidence] = useState(null);
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
                setIsVerify(false);
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
                setIsVerify(false);
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        })
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

    const toggleCancel = () => {
        setIsVerify(false);
        resetState();
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection onBackButtonClick={handleRedirectBack} title="Donation Details"/>
            <div id='donation-details-section'>
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
                    label = "Course"
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
            {
                donation.status=="Verified"?
                <div id="donation-button-row">
                    <button className='button' id="donate-button" onClick={handleButtonOnClick}>Generate Receipt</button>
                </div>:
                <div id="donation-button-row">
                    {isVerify?
                    <div id="save-section">
                        <button onClick={toggleCancel} id="cancel-button">Cancel</button>
                        <button onClick={toggleSave} id="save-button">Save</button>
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