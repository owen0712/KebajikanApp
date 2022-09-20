import React, { useEffect, useRef, useState } from 'react'
import './manage_item_donation_appointment.css';
import BackSection from '../../../components/BackSection';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';
import { Loading } from '../../../components';

const ManageItemDonationAppointment = (props) => {

    const [date,setDate] = useState("");
    const [time,setTime] = useState("");
    const [location,setLocation] = useState("");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone_number,setPhoneNumber] = useState("");
    const [event,setEvent] = useState(null);
    const [appointment,setAppointment] = useState(null);
    const [isLoading,setIsLoading] = useState(true);
    const [isEdit,setIsEdit] = useState(props.isEdit);
    const id = useParams();
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
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/appointment/'+id.id,{
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
                setAppointment(data.appointment)
                setEvent(data.appointment.charity_event_id);
                setDate(data.appointment.date.slice(0,10));
                setTime(data.appointment.time);
                setLocation(data.appointment.location);
                setName(data.appointment.name);
                setEmail(data.appointment.email);
                setPhoneNumber(data.appointment.phone_number);
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
        fetch('/appointment/'+id.id,{
            method:'put',
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
                phone_number
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
        fetchData();
    };

    const handleRedirectBack = () => {
        navigate('/profile/donation_history');
    }

    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <BackSection onBackButtonClick={handleRedirectBack} title={isEdit?"Edit Item Donation Appointment":"View Item Donation Appointment"}/>
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
                        <input type="date" name="date" defaultValue={date} onChange={event=>handleDateOnChange(event)} disabled={!isEdit}/>
                    </span>
                    <span className="short-input">
                        <label >TIME</label>
                        <input type="time" name="time" defaultValue={time} onChange={event=>handleTimeOnChange(event)} disabled={!isEdit}/>
                    </span>
                    <span className="short-input">
                        <label >LOCATION</label>
                        <input type="text" name="location" defaultValue={location} onChange={event=>handleLocationOnChange(event)} disabled={!isEdit}/>
                    </span>
                    <span className="short-input">
                        <label >NAME</label>
                        <input type="text" name="name" defaultValue={name} onChange={event=>handleNameOnChange(event)} disabled={!isEdit}/>
                    </span>
                    <span className="short-input">
                        <label >EMAIL</label>
                        <input type="email" name="email" defaultValue={email} onChange={event=>handleEmailOnChange(event)} disabled={!isEdit}/>
                    </span>
                    <span className="short-input">
                        <label >PHONE NUMBER</label>
                        <input type="text" name="phone_number" defaultValue={phone_number} onChange={event=>handlePhoneNumberOnChange(event)} disabled={!isEdit}/>
                    </span>
                    {isEdit?<div id="save-section">
                    <button onClick={toggleCancel} id="cancel-button">Cancel</button>
                    <input type="submit" value="Save" id="create-button"/>
                    </div>:
                    <button onClick={toggleEdit} id="create-button">Edit</button>
                    }
                </form>
            </div>
            </>}
        </React.Fragment>
    )
}

export default ManageItemDonationAppointment;