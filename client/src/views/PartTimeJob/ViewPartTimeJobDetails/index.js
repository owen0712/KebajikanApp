import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './view_part_time_job_details.css';
import BackSection from '../../../components/BackSection';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ViewPartTimeJobDetails = (props) => {

    const [event,setEvent] = useState([]); 
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();
    const id = useParams();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/part_time_job/'+id.id,{
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

    const handleApply = (id) => {
        navigate('/part_time_job/apply/'+id);
    }

    const handleChat = (id) =>{
        navigate('/chat/'+id);
    }

    const navigatePrev = () =>{
        navigate('/part_time_job/view');
    }
        
    return (
        <React.Fragment>
            <BackSection onBackButtonClick={navigatePrev} title="View Part-Time Job Details"/>
            {isLoading?"":<>
            <div id="job-details-section">
                <img src={event.photo.content}/>
                <span>
                    <p id="organizer"><AccountCircleIcon/>{event.organizer_id.name}</p>
                    <p id="title">{event.title}</p>
                    <p>Description: {event.description}</p>
                    <p>Allowance: RM{event.allowance}</p>
                    <p>Status: {event.status}</p>
                    <p>Closed Date: {event.closed_date.slice(0,10)}</p>
                    <button onClick={()=>handleApply(event._id)} className="apply-button">Apply Now</button>
                    <button onClick={()=>handleChat(event.organizer_id._id)} className="chat-button">Chat</button>
                </span>
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewPartTimeJobDetails;