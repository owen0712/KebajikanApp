import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './view_charity_event.css';
import AddIcon from '@mui/icons-material/Add';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Swal from 'sweetalert2';

const ViewCharityEvent = (props) => {

    const [events,setEvents] = useState([]); 
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/charity_event/view',{
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
                setEvents(data.events);
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

    const handleView = (id) => {
        navigate('/charity_event/view/'+id);
    }

    const handleClick = (action,id) => {
        navigate(`/charity_event/${action}/${id}`);
    }

    const handlePropose = () => {
        navigate('/charity_event/create');
    }
        
    return (
        <React.Fragment>
            {isLoading?<h1>Loading...</h1>:<>
            <div id="carousel">
                <ArrowLeftIcon/>
                <img src={events[0].photo.content} onClick={()=>handleView(events[0]._id)}/>
                <span>
                    <h1 onClick={()=>handleView(events[0]._id)}>{events[0].title}</h1>
                    <p onClick={()=>handleView(events[0]._id)}>Purpose: {events[0].purpose}</p>
                    <p onClick={()=>handleView(events[0]._id)}>Description: {events[0].description}</p>
                    <p onClick={()=>handleView(events[0]._id)}>Target Amount: {events[0].amount}</p>
                    <button onClick={events[0].status=="In Progress"?()=>handleClick("donate",events[0]._id):()=>handleClick("apply_help",events[0]._id)} className={events[0].status=="In Progress"?"donate-button":"preregistration-button"}>{events[0].status=="In Progress"?"Donate":"Apply For Help"}</button>
                </span>
                <ArrowRightIcon/>
            </div>
            <div id="title-section">
                <p>Charity Event</p>
                <button onClick={handlePropose}><AddIcon />Propose New Charity Event</button>
            </div>
            <div id="event-list">
                {events.map(event=>{
                    return <span key={event._id} className='card'>
                        <img src={event.photo.content} onClick={()=>handleView(event._id)}/>
                        <h4 onClick={()=>handleView(event._id)}>{event.title}</h4>
                        <p onClick={()=>handleView(event._id)}>Purpose: {event.purpose}</p>
                        <p onClick={()=>handleView(event._id)}>Target Amount: RM{event.amount}</p>
                        <button onClick={event.status=="In Progress"?()=>handleView(event._id):()=>handleClick("apply_help",event._id)} className={event.status=="In Progress"?"donate-button":"preregistration-button"}>{event.status=="In Progress"?"Donate":"Apply For Help"}</button>
                    </span>
                })}
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewCharityEvent;