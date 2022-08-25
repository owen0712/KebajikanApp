import React, { useEffect, useRef, useState } from 'react'
import './create_money_donation.css';
import BackSection from '../../../components/BackSection';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import { Loading } from '../../../components';
import LockIcon from '@mui/icons-material/Lock';

const CreateMoneyDonation = (props) => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone_number,setPhoneNumber] = useState("");
    const [amount,setAmount] = useState(0);
    const [event,setEvent] = useState(null);
    const [isAgree,setIsAgree] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    const event_id = useParams();
    const navigate = useNavigate();
    const user = useUser();
    const amountInputRef = useRef();

    const amountOption = [10,50,100,200];

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/charity_event/'+event_id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
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
                setEvent(data.event);
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

    const handleNameOnChange = (event) => {
        setName(event.target.value);
    }

    const handleEmailOnChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePhoneNumberOnChange = (event) => {
        setPhoneNumber(event.target.value);
    }

    const handleAmountOnChange = (event) => {
        setAmount(event.target.value);
    }

    const handleAmountButtonOnClick = (event,amount) => {
        event.preventDefault();
        setAmount(amount);
        amountInputRef.current.value=amount;
    }

    const handleIsAgreeOnChange = (event) => {
        setIsAgree(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!isAgree){
            Swal.fire({
                icon:"error",
                title:"Please tick the agreement checkbox",
                confirmButtonText: 'Ok'
            });
            return;
        }
        fetch('/donation/money/'+event_id.id,{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                name,
                email,
                phone_number,
                amount
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon:"error",
                    title:data.error
                });
            }
            else{
                window.location.href=data.url;
            }
        }).catch(err=>{
            Swal.fire({
                icon:"error",
                title:err
            });
        })
    }

    const handleRedirectBack = () => {
        navigate('/charity_event/view/'+event_id.id);
    }

    return (
        <React.Fragment>
            {user==null?<Navigate to="/login"/>:<></>}
            {isLoading?<Loading/>:<>
            <BackSection onBackButtonClick={handleRedirectBack} title="Money Donation"/>
            <div id="donation-left-content">
                <img src={event.photo.content}/>
                <h2>{event.title}</h2>
                <p>Purpose: {event.purpose}</p>
                <p>Description: {event.description}</p>
                <p>Target Amount: RM{event.amount}</p>
                <p>Duration: {event.donation_start_date.slice(0,10)} - {event.donation_end_date.slice(0,10)}</p>
            </div>
            <div id="donation-right-content">
                <form id="donation_form" onSubmit={event=>handleSubmit(event)}>
                    <span className="short-input">
                        <label >NAME</label>
                        <input type="text" name="name" defaultValue={name} onChange={event=>handleNameOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >EMAIL</label>
                        <input type="email" name="email" onChange={event=>handleEmailOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >PHONE NUMBER</label>
                        <input type="text" name="phone_number" onChange={event=>handlePhoneNumberOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >AMOUNT(RM)</label>
                        <input ref={amountInputRef} type="number" name="amount" min="1" onChange={event=>handleAmountOnChange(event)}/>
                    </span>
                    <div className='amount-list'>
                        {
                            amountOption.map(amount=>{
                                return <button key={amount} onClick={(event)=>handleAmountButtonOnClick(event,amount)} className="amount-button">RM{amount}</button>
                            })
                        }
                    </div>
                    <span id="secure-message"><LockIcon/>Your payment is 100% secure</span>
                    <div id="tnc-section">
                        <input type="checkbox" onChange={event=>handleIsAgreeOnChange(event)}/>
                        <p>By proceeding you agree to our <a>Term and Condition</a>.Transaction fee applied.</p>
                    </div>
                    <input type="submit" value="Submit" id="submit-button"/>
                </form>
            </div>
            </>}
        </React.Fragment>
    )
}

export default CreateMoneyDonation;