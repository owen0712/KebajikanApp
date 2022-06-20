import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './view_charity_event_details.css';
import BackSection from '../../../components/BackSection';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ViewCharityEventDetails = (props) => {

    const [event,setEvent] = useState([]); 
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();
    const id = useParams();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/charity_event/'+id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setEvent(data.event);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleClick = (action,id) => {
        navigate(`/charity_event/${action}/${id}`);
    }
        
    return (
        <React.Fragment>
            <BackSection title="View Charity Event Details"/>
            {isLoading?"":<>
            <div id="event-details-section">
                <img src={event.photo.content}/>
                <span>
                    <p id="organizer"><AccountCircleIcon/>{event.organizer_id.name}</p>
                    <p id="title">{event.title}</p>
                    <p>Purpose: {event.purpose}</p>
                    <p>Target Amount: RM{event.amount}</p>
                    <p>Duration: {event.status=="In Progress"?`${event.donation_start_date.slice(0,10)} - ${event.donation_end_date.slice(0,10)}`:`${event.preregister_start_date.slice(0,10)} - ${event.preregister_end_date.slice(0,10)}`}</p>
                    {event.status=="In Progress"?<>
                    <button onClick={()=>handleClick("donate_money",event._id)} className={"donate-button"}>Donate Money</button>
                    <button onClick={()=>handleClick("donate_item",event._id)} className={"donate-button"}>Donate Item</button>
                    </>:
                    <button onClick={()=>handleClick("apply_help",event._id)} className="preregistration-button">Apply For Help</button>
                    }
                </span>
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewCharityEventDetails;