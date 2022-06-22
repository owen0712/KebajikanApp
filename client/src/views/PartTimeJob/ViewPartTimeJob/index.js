import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './view_part_time_job.css';
import { Slide } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Swal from 'sweetalert2';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Status, BackSection } from '../../../components';

const ViewPartTimeJob = (props) => {

    const navigate = useNavigate();
    const [events,setEvents] = useState([]);
    const [firstEvent,setFirstEvent] = useState(null);
    const [firstImageDisplay,setFirstImageDisplay] = useState('');
    const [isLoading,setIsLoading] = useState(false);

    useEffect(()=>{
        console.log("Before")
        fetchData();
        console.log("AFter")
    },[])

    const fetchData = () =>{
        setIsLoading(true);
        fetch('/part_time_job/available',{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                
                setEvents(data.events)  
                
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleApply = (id) => {
        navigate('/part_time_job/apply/'+id);
    }

    const handleView = (id) => {
        navigate('/part_time_job/view/'+id);
    }

    const errorHandler = (event) => {
        event.currentTarget.onerror = null; 
        event.currentTarget.src=props.fallbackSrc;
    }
    return (
        <React.Fragment>
            {isLoading?<p>The content is loading</p>:<>
            <div id="carousel">
                <ArrowLeftIcon/>
                {/* <img src={""} onError={errorHandler} onClick={()=>handleView(firstEvent._id)}/> */}
                {/* <span>
                    <h1 onClick={()=>handleView(events[0]._id)}>{events[0].title}</h1>
                    <p onClick={()=>handleView(events[0]._id)}>Description: {events[0].description}</p>
                    <p onClick={()=>handleView(events[0]._id)}>Target Amount: {events[0].amount}</p>
                    <button onClick={()=>handleApply(events[0]._id)} className="apply-button">Apply</button>
                </span> */}
                <ArrowRightIcon/>
            </div>
            <div id="title-section">
                <p>Part-Time Job</p>
                <button><AddIcon/>Propose New Part-Time Job</button>
            </div>
            <div id="job-list">
                {events.map(event=>{
                return(
                <Card onClick={()=>handleView(firstEvent._id)} key={event._id} className="job-card">
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        height="140"
                        src={event.photo.content}
                    />
                    <CardContent className="job-content">
                        <p className="job-title">
                            {event.title}
                        </p>
                        <p className="job-description">
                            Description: {event.description}
                        </p>
                        <p className="job-description">
                            Allowance: RM {event.allowance}
                        </p>
                    </CardContent>
                    <CardActions className="action-section">
                        <button onClick={()=>handleApply(event._id)} className="apply-button">Apply</button>
                    </CardActions>
                </Card>)
                })}
            </div>
            <div id="#part-time-job-list">
                
                {/* <div id="part-time-job-list-pagination">
                    <ArrowLeftIcon/>
                    <input type="number" defaultValue={pageNumber}/>
                    <p>/{events.length/7}</p>
                    <ArrowRightIcon/>
                </div> */}
            </div>
            </>}            
        </React.Fragment>
    )
}

export default ViewPartTimeJob;