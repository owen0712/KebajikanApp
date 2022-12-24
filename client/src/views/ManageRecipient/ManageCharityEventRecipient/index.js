import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './manage_charity_recipient.css';
import BackSection from '../../../components/BackSection';
import Swal from 'sweetalert2';
import { Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ManageCharityEventRecipients = (props) => {

    const [isLoading,setIsLoading] = useState(true);
    const [application,setApplication] = useState(null);
    const [name,setName] = useState("");
    const [allowance,setAllowance] = useState(0);
    const [status,setStatus] = useState("");
    const [bank_acc,setBankAcc] = useState("");
    const [bank,setBank] = useState("");
    const [details,setDetails] = useState(null);
    const [receipt,setReceipt] = useState({name:"",content:""});
    const [isEdit,setIsEdit] = useState(props.isEdit);
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
                navigate('/login');
            }
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/charity_application/view/'+id,{
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
                const application = data.event;
                setApplication(application);
                setName(application.name);
                setAllowance(application.allowance);
                setStatus(application.status);
                setBankAcc(application.bank_acc);
                setBank(application.bank);
                setReceipt(application.receipt);
                setDetails(application.event_id.title+" Program");
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
        fileUploadInput.current.click();
    }

    const handleFileOnChange = (event) => {
        const setDocumentUploaded = (documentUploaded) =>{
            setReceipt(documentUploaded);
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
        fetch('/charity_application/recipient/'+id,{
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

    const handleRedirectBack = () => {
        navigate('/manage_charity_event/view/'+application.event_id._id);
    }

    const toggleCancel = () => {
        setIsEdit(false);
        resetState();
    }

    const resetState = () => {
        fetchData();
    };

    const handleViewFile = () => {
        fetch('/charity_event/receipt/'+id,{
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
            <BackSection onBackButtonClick={handleRedirectBack} title={isEdit?`Edit Recipient`:`View Recipient`}/>
            {isLoading?<Loading/>:<>
            <form id='manage-charity-recipient-form' onSubmit={handleSubmit}>
                <span className="short-input">
                    <label >RECIPIENT NAME</label>
                    <input type="text" name="name" defaultValue={name} onChange={event=>handleNameOnChange(event)} disabled={true} />
                </span>
                <span className="short-input">
                    <label >ALLOWANCE (RM)</label>
                    <input type="number" name="allowance" min="0" defaultValue={allowance} onChange={event=>handleAllowanceOnChange(event)} disabled={!isEdit} />
                </span>
                {!isEdit&&<span className="short-input">
                    <label >STATUS</label>
                    <input type="text" name="status" defaultValue={status} onChange={event=>handleStatusOnChange(event)}  disabled={!isEdit} />
                </span>}
                {isEdit&&<span className="short-input">
                    <label >STATUS</label>
                    <select type="text" name="status" defaultValue={status} onChange={event=>handleStatusOnChange(event)}>
                        <option>Approved</option>
                        <option>Paid</option>
                    </select>
                </span>}
                <span className="short-input">
                    <label >BANK ACCOUNT</label>
                    <input type="text" name="bank_acc" defaultValue={bank_acc} onChange={event=>handleBankAccOnChange(event)}  disabled={true} />
                </span>
                <span className="short-input">
                    <label >BANK</label>
                    <input type="text" name="bank" defaultValue={bank} onChange={event=>handleBankOnChange(event)}  disabled={true} />
                </span>
                <span className="short-input">
                    <label >RECEIPT</label>
                    <input className="hidden" ref={fileUploadInput} onChange={event=>handleFileOnChange(event)} type="file" accept=".pdf" name="receipt"/>
                    {isEdit&&<iframe className="hidden" src={receipt.content} title={receipt.name}></iframe>}
                    <input className={isEdit?"":"read-only"} ref={fileTextDisplay} onClick={handleTextInputOnClick} type="text" defaultValue={receipt.name} readOnly={!isEdit}/>
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
            </>}
        </React.Fragment>
        )
    }


export default ManageCharityEventRecipients;