import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './view_part_time_job_details.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Loading, BackSection } from '../../../components';
import { useUser } from '../../../contexts/UserContext';

const ViewPartTimeJobDetails = (props) => {

    const [job,setJob] = useState([]); 
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();
    const job_id = useParams();
    const user = useUser();

    useEffect(()=>{
        fetchData();
    },[])

    const fetchData = () => {
        setIsLoading(true);
        fetch('/part_time_job/'+job_id.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setJob(data.event);
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
            {isLoading?<Loading/>:<>
            <div id="job-details-section">
                <img src={job.photo.content}/>
                <span>
                    <p id="organizer"><AccountCircleIcon/>{job.organizer_id.name}</p>
                    <p id="title">{job.title}</p>
                    <p>Description: {job.description}</p>
                    <p>Allowance: RM{job.allowance}</p>
                    <p>Status: {job.status}</p>
                    <p>Closed Date: {job.closed_date.slice(0,10)}</p>
                    <button onClick={()=>handleApply(job._id)} className="apply-button">Apply Now</button>
                    {(user.id!=job.organizer_id._id)&&<button onClick={()=>handleChat(job.organizer_id._id)} className="chat-button">Chat</button>}
                </span>
            </div>
            </>}
        </React.Fragment>
    )
}


export default ViewPartTimeJobDetails;