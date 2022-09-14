import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './view_charity_event.css';
import AddIcon from '@mui/icons-material/Add';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Swal from 'sweetalert2';
import { Loading } from '../../../components';
import Pagination from '@mui/material/Pagination';

const ViewCharityEvent = (props) => {

    const [events,setEvents] = useState([]); 
    const [displayedEvents,setDisplayEvents] = useState([]);
    const [page,setPage] = useState(0);
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();
    const ROW_PER_PAGE = 6;

    useEffect(()=>{
        fetchData();
    },[])

    useEffect(()=>{
        setDisplayedEvent();
    },[page,events])

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
                setPage(1);
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

    const handlePageOnChange = (event, value) => {
        setPage(value);
    }

    const setDisplayedEvent = () =>{
        const firstRow = (page-1) * ROW_PER_PAGE + 1;
        const lastRow =  page * ROW_PER_PAGE;
        if(lastRow>=events.length){
            setDisplayEvents(events.slice(firstRow-1));
        }
        setDisplayEvents(events.slice(firstRow-1,lastRow));
    }
        
    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <div id="carousel">
                <ArrowLeftIcon/>
                <img src={events[0].photo.content} onClick={()=>handleView(events[0]._id)}/>
                <span>
                    <h1 onClick={()=>handleView(events[0]._id)}>{events[0].title}</h1>
                    <p onClick={()=>handleView(events[0]._id)}>Purpose: {events[0].purpose}</p>
                    <p onClick={()=>handleView(events[0]._id)}>Description: {events[0].description}</p>
                    <p onClick={()=>handleView(events[0]._id)}>Target Amount: {events[0].amount}</p>
                    <button onClick={events[0].status=="In Progress"?()=>handleClick("view",events[0]._id):()=>handleClick("apply_help",events[0]._id)} className={events[0].status=="In Progress"?"donate-button":"preregistration-button"}>{events[0].status=="In Progress"?"Donate":"Apply For Help"}</button>
                </span>
                <ArrowRightIcon/>
            </div>
            <div id="title-section">
                <p>Charity Event</p>
                <button onClick={handlePropose}><AddIcon />Propose New Charity Event</button>
            </div>
            <div id="event-list">
                {displayedEvents.map(event=>{
                    return <span key={event._id} className='card'>
                        <img src={event.photo.content} onClick={()=>handleView(event._id)}/>
                        <h4 onClick={()=>handleView(event._id)}>{event.title}</h4>
                        <p onClick={()=>handleView(event._id)}>Purpose: {event.purpose}</p>
                        <p onClick={()=>handleView(event._id)}>Target Amount: RM{event.amount}</p>
                        <button onClick={event.status=="In Progress"?()=>handleView(event._id):()=>handleClick("apply_help",event._id)} className={event.status=="In Progress"?"donate-button":"preregistration-button"}>{event.status=="In Progress"?"Donate":"Apply For Help"}</button>
                    </span>
                })}
            </div>
            <div id="event-list-pagination">
                    <Pagination count={events.length<=ROW_PER_PAGE?1:parseInt(events.length/ROW_PER_PAGE)+1} page={page} onChange={handlePageOnChange} />
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewCharityEvent;