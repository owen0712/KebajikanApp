import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './transfer_donation.css';
import Swal from 'sweetalert2';
import { Loading, Dropdown, BackSection } from '../../../components';
import { useUser } from '../../../contexts/UserContext';
import Pagination from '@mui/material/Pagination';

const bankOption = [
    "Ambank",
    "Alliance Bank",
    "Bank Islam",
    "Bank Rakyat",
    "CIMB Bank",
    "Maybank",
    "Hong Leong Bank",
    "Public Bank"
];

const TransferDonation = (props) => {

    const [isLoading,setIsLoading] = useState(true);
    const [events,setEvents] = useState([]);
    const [recipients,setRecipients] = useState([]);
    const [selectedEventId,setSelectedEventId] = useState("");
    const [selectedRecipientId,setSelectedRecipientId] = useState("");
    const [donationMode, setDonationMode] = useState("Money");
    const [bank,setBank] = useState("");
    const [bankAccount,setBankAccount] = useState("");
    const [donationAmount,setDonationAmount] = useState(0);
    const [availableBalance,setAvailableBalance] = useState(0);
    const [newBalance,setNewBalance] = useState(0);
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
            if(user.role!=2){
                navigate('/');
            }
            fetchData();
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])


    const fetchData = async() =>{
        setIsLoading(true);
        
        fetch('/charity_event/closed',{
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
                let closedEvents = [];
                let eventsList=data.events;
                eventsList.map((event)=>{
                    closedEvents.push({label: event.title, value:event._id, recipients:event.recipients, availableAmount:event.current_amount})
                });
                setEvents(closedEvents);
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

    const handleSelectedEventIdOnChange = (event) => {
        setSelectedEventId(event.target.value);
        let recipientsOption = [];
        let selectedCharityEvent = events.find((e)=>e.value==event.target.value);
        if (selectedCharityEvent && selectedCharityEvent.recipients){
            selectedCharityEvent.recipients.forEach((recipient)=>{
                recipientsOption.push({label: recipient.name, value:recipient._id})
            });
        }
        setAvailableBalance(selectedCharityEvent.availableAmount);
        setRecipients(recipientsOption);
    }

    const handleSelectedRecipientIdOnChange = (event) => {
        setSelectedRecipientId(event.target.value);
    }

    const handleBankOnChange = (event) => {
        setBank(event.target.value);
    }

    const handleDonationModeOnChange = (event) => {
        setDonationMode(event.target.value);
    }

    const handleDonationAmountOnChange = (event) => {
        setDonationAmount(event.target.value);
        setNewBalance(availableBalance-event.target.value);
    }

    const handleBankAccountOnChange = (event) => {
        setBankAccount(event.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(donationAmount>availableBalance){
            Swal.fire({
                icon: 'error',
                title: "Donation Amount Exceed Available Balance",
            })
            return;
        }
        let param = {
            selectedEventId,
            selectedRecipientId,
            donationMode,
            bank,
            bankAccount,
            donationAmount
        };
        console.log("Transfering...",param);
    }
        
    const navigatePrev = () =>{
        navigate('/manage_donation');
    }

    return (
        <React.Fragment>
            <BackSection title="Transfer Money" onBackButtonClick={navigatePrev}/>
            <div id='charity-recipient-section'>
            {isLoading?<Loading/>:<div id='transfer-donation-details'>
            <form id="transfer-donation-form" onSubmit={event=>handleSubmit(event)}>
                    <Dropdown 
                        isDisabled = {events.length<=0}
                        optionList={events}
                        label = "EVENT"
                        value = {selectedEventId}
                        handleOnChange = {handleSelectedEventIdOnChange}
                        inputClassName = "full-input"
                        styling = {{width : "80%"}}
                    />
                    {(events.length<=0)&&<p className="empty-option-reminder">**No closed charity event record was found</p>}
                    <Dropdown 
                        isDisabled = {recipients.length<=0}
                        optionList={recipients}
                        label = "RECIPIENT NAME"
                        value = {selectedRecipientId}
                        handleOnChange = {handleSelectedRecipientIdOnChange}
                        inputClassName = "full-input"
                        styling = {{width : "80%"}}
                    />
                    {(recipients.length<=0)&&<p className="empty-option-reminder">**No recipient record was found</p>}
                    <span className="full-input">
                        <label >DONATION MODE</label>
                        <input type="text" name="donation-mode" defaultValue="Money" onChange={event=>handleDonationModeOnChange(event)} disabled/>
                    </span>
                    <Dropdown 
                        optionList={bankOption}
                        label = "Bank"
                        value = {bank}
                        handleOnChange = {handleBankOnChange}
                        inputClassName = "full-input"
                        styling = {{width : "80%"}}
                    />
                    <span className="full-input">
                        <label >BANK ACCOUNT</label>
                        <input type="number" min={0} name="bank-account" onChange={event=>handleBankAccountOnChange(event)}/>
                    </span>
                    <span className="full-input">
                        <label >DONATION AMOUNT</label>
                        <input type="number" min={0} max={availableBalance} name="donation-amount" onChange={event=>handleDonationAmountOnChange(event)}/>
                    </span>
                    <span className="full-input">
                        <label >AVAILABLE BALANCE</label>
                        <input type="number" name="amount" value={availableBalance} disabled/>
                    </span>
                    <span className="full-input">
                        <label >NEW BALANCE</label>
                        <input type="number" name="amount" value={newBalance} disabled/>
                    </span>
                    <input type="submit" value="TRANSFER NOW" id="transfer-button"/>
                </form>
            </div>}
            </div>
        </React.Fragment>
        )
    }


export default TransferDonation;