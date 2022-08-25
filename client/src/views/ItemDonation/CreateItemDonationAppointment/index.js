import React, { useEffect, useRef, useState } from 'react'
import './create_item_donation_appointment.css';
import BackSection from '../../../components/BackSection';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import { Loading } from '../../../components';

const CreateItemDonationAppointment = (props) => {

    const [date,setDate] = useState("");
    const [time,setTime] = useState("");
    const [location,setLocation] = useState("");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone_number,setPhoneNumber] = useState("");
    const [event,setEvent] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const event_id = useParams();
    const navigate = useNavigate();
    const user = useUser();

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

    const handleDateOnChange = (event) => {
        setDate(event.target.value);
    }

    const handleTimeOnChange = (event) => {
        setTime(event.target.value);
    }

    const handleLocationOnChange = (event) => {
        setLocation(event.target.value);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('/appointment/'+event_id.id,{
            method:'post',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            },
            body:JSON.stringify({
                date,
                time,
                location,
                name,
                email,
                phone_number,
                user_id:user.id
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                Swal.fire({
                    icon:"error",
                    title:data.error
                });
            }
            else{
                Swal.fire({
                    icon:"success",
                    title:data.message
                }).then(
                    navigate('/charity_event/view/'+event_id.id)
                );
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
            <BackSection onBackButtonClick={handleRedirectBack} title="Item Donation Appointment"/>
            <div id="appointment-left-content">
                <img src={event.photo.content}/>
                <h2>{event.title}</h2>
                <p>Purpose: {event.purpose}</p>
                <p>Description: {event.description}</p>
                <p>Target Amount: RM{event.amount}</p>
                <p>Duration: {event.donation_start_date.slice(0,10)} - {event.donation_end_date.slice(0,10)}</p>
            </div>
            <div id="appointment-right-content">
                <form id="announcement_form" onSubmit={event=>handleSubmit(event)}>
                    <span className="short-input">
                        <label >DATE</label>
                        <input type="date" name="date" onChange={event=>handleDateOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >TIME</label>
                        <input type="time" name="time" onChange={event=>handleTimeOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >LOCATION</label>
                        <input type="text" name="location" onChange={event=>handleLocationOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >NAME</label>
                        <input type="text" name="name" onChange={event=>handleNameOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >EMAIL</label>
                        <input type="email" name="email" onChange={event=>handleEmailOnChange(event)}/>
                    </span>
                    <span className="short-input">
                        <label >PHONE NUMBER</label>
                        <input type="text" name="phone_number" onChange={event=>handlePhoneNumberOnChange(event)}/>
                    </span>
                    <input type="submit" value="Submit" id="submit-button"/>
                </form>
            </div>
            </>}
        </React.Fragment>
    )
}

export default CreateItemDonationAppointment;