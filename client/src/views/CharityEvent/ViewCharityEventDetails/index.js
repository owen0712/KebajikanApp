import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './view_charity_event_details.css';
import BackSection from '../../../components/BackSection';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Swal from 'sweetalert2';
import { Loading } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ViewCharityEventDetails = (props) => {

    const [event,setEvent] = useState([]); 
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();
    const id = useParams();
    const user = useUser();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/charity_event/view/'+id.id,{
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

    const handleClick = (action,id) => {
        if(!user){
            Swal.fire({
                title: "Please login to continue your action",
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            return;
        }
        navigate(`/charity_event/${action}/${id}`);
    }

    const handleChat = (id) =>{
        navigate('/chat/'+id);
    }

    const handleRedirectBack = () => {
        navigate('/charity_event/view')
    }
        
    return (
        <React.Fragment>
            <BackSection title="View Charity Event Details" onBackButtonClick={handleRedirectBack}/>
            {isLoading?<Loading/>:<>
            <div id="event-details-section">
                <img src={event.photo.content}/>
                <span>
                    <p id="organizer"><AccountCircleIcon/>{event.organizer_id.name}</p>
                    <p id="title">{event.title}</p>
                    <p>Purpose: {event.purpose}</p>
                    <p>Target Amount: RM{event.amount}</p>
                    <p>Duration: {event.status=="In Progress"?`${event.donation_start_date.slice(0,10)} - ${event.donation_end_date.slice(0,10)}`:`${event.preregister_start_date.slice(0,10)} - ${event.preregister_end_date.slice(0,10)}`}</p>
                    {event.status=="In Progress"?<>
                    <button onClick={()=>handleClick("donate_money",event._id)} className="donate-button">Donate Money</button>
                    <button onClick={()=>handleClick("appointment",event._id)} className="donate-button">Donate Item</button>
                    </>:
                    <button onClick={()=>handleClick("apply_help",event._id)} className="preregistration-button">Apply For Help</button>
                    }
                    {!user||user?.id==event.organizer_id._id?"":<button onClick={()=>handleChat(event.organizer_id._id)} className="chat-button">Chat</button>}
                </span>
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewCharityEventDetails;