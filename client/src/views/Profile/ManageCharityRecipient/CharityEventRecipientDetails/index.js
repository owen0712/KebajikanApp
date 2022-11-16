import React, { useState, useEffect } from 'react'
import './charity_event_recipient_details.css';
import Swal from 'sweetalert2';
import { useUser } from '../../../../contexts/UserContext';

const CharityEventRecipientDetails = (props) => {

    const [application,setApplication] = useState(props.application);
    const [name,setName] = useState(props.application?.name);
    const [allowance,setAllowance] = useState(props.application?.allowance);
    const [status,setStatus] = useState(props.application?.status);
    const [bank_acc,setBankAcc] = useState(props.application?.bank_acc);
    const [bank,setBank] = useState(props.application?.bank);
    const [details,setDetails] = useState(props.application?.details);
    const [receipt,setReceipt] = useState(props.application?.receipt);
    const [isEdit,setIsEdit] = useState(false);
    const user = useUser();

    useEffect(()=>{
        resetState();
        console.log(details)
    },[props.application])

    const handleNameOnChange = (event) => {
        setName(event.target.value);
    }

    const handleAllowanceOnChange = (event) =>{
        setAllowance(event.target.value);
    }

    const handleStatusOnChange = (event) => {
        setStatus(event.target.value);
    }

    const handleBankAccOnChange = (event) =>{
        setBankAcc(event.target.value);
    }

    const handleBankOnChange = (event) => {
        setBank(event.target.value);
    }
    
    const handleDetailsOnChange = (event) => {
        setDetails(event.target.value);
    }

    const handleTextInputOnClick = () => {
        if(!isEdit){
            handleViewFile();
            setReceipt(prev=>({...prev,name:receipt.name}));
            return;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        var request_body = {
            name,
            allowance,
            status,
            bank_acc,
            bank,
            details
        };
        if(receipt&&receipt?.content){
            request_body = {...request_body, receipt}
        }
        fetch('/charity_application/recipient/'+application._id,{
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
                setReceipt({name:receipt.name});
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

    const toggleCancel = () => {
        setIsEdit(false);
        resetState();
    }

    const resetState = () => {
        setApplication(props.application);
        setName(props.application?.name);
        setAllowance(props.application?.allowance);
        setStatus(props.application?.status);
        setBankAcc(props.application?.bank_acc);
        setBank(props.application?.bank);
        setReceipt(props.application?.receipt);
        setDetails(props.application?.event_id.title+" Program");
        setReceipt(props.application?.receipt);
    };

    const handleViewFile = () => {
        fetch('/charity_event/receipt/'+application._id,{
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
                setReceipt(data.receipt);
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
            <form id='charity-recipient-form' onSubmit={handleSubmit}>
                <span className="short-input">
                    <label >RECIPIENT NAME</label>
                    <input type="text" name="name" defaultValue={name} onChange={event=>handleNameOnChange(event)} disabled={!isEdit} />
                </span>
                <span className="short-input">
                    <label >ALLOWANCE (RM)</label>
                    <input type="number" name="allowance" min="0" defaultValue={allowance} onChange={event=>handleAllowanceOnChange(event)} disabled={true} />
                </span>
                <span className="short-input">
                    <label >STATUS</label>
                    <input type="text" name="status" defaultValue={status} onChange={event=>handleStatusOnChange(event)}  disabled={true} />
                </span>
                <span className="short-input">
                    <label >BANK ACCOUNT</label>
                    <input type="text" name="bank_acc" defaultValue={bank_acc} onChange={event=>handleBankAccOnChange(event)}  disabled={!isEdit} />
                </span>
                <span className="short-input">
                    <label >BANK</label>
                    <input type="text" name="bank" defaultValue={bank} onChange={event=>handleBankOnChange(event)}  disabled={!isEdit} />
                </span>
                <span className="short-input">
                    <label >RECEIPT</label>
                    {isEdit&&<iframe className="hidden" src={receipt?.content} title={receipt?.name}></iframe>}
                    <input className={isEdit?"":"read-only"} onClick={handleTextInputOnClick} type="text" defaultValue={receipt?.name} readOnly={true} disabled={isEdit}/>
                </span>
                <span className="short-input">
                    <label >DETAILS</label>
                    <input type="text" name="details" defaultValue={details} onChange={event=>handleDetailsOnChange(event)}  disabled={true} />
                </span>
                {isEdit?<div id="save-section">
                <button onClick={toggleCancel} id="cancel-button">Cancel</button>
                <input type="submit" value="Save" id="create-button"/>
                </div>:
                <button onClick={toggleEdit} id="create-button">Edit</button>
                }
            </form>
        </React.Fragment>
        )
    }


export default CharityEventRecipientDetails;