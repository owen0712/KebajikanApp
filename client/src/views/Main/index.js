import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';
import logo from '../../assets/img/main-logo.png'
import Swal from 'sweetalert2';
import { Loading } from '../../components';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const Main = (props) => {

    const [events,setEvents] = useState([]);
    const [announcements,setAnnouncements] = useState([]);
    const [jobs,setJobs] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(()=>{
        fetchEventData();
        fetchJobData();
        fetchAnnouncementData();
    },[])

    const fetchEventData = () => {
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
                setEvents(data.events.slice(0, 3));
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const fetchJobData = () => {
        fetch('/part_time_job/available',{
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
                setJobs(data.events.slice(0, 3));
            }
        }).catch(err=>{
            Swal.fire({
                title: err,
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        })
    }

    const fetchAnnouncementData = () => {
        fetch('/announcement',{
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
                setAnnouncements(data.announcements.slice(0, 3));
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

    const handleEventView = (id) => {
        navigate('/charity_event/view/'+id);
    }

    const handleJobView = (id) => {
        navigate('/part_time_job/view/'+id);
    }

    const handleAnnouncementView = (id) => {
        navigate('/announcement/view');
    }

    const handleClick = (action,id) => {
        navigate(`/charity_event/${action}/${id}`);
    }

    const handleApply = (id) => {
        navigate('/part_time_job/apply/'+id);
    }

    const handleViewMoreOnClick = (destination) => {
        navigate(destination);
    }
        
    return (
        <React.Fragment>
            {isLoading?<Loading/>:<>
            <div id="main-upper-part">
                <div id='title'>
                    <p>Welcome to </p>
                    <p>Kebajikan App</p>
                </div>
                <div>
                    <img src={logo}/>
                </div>
            </div>
            <div id="main-content-part">
                <div className='row'>
                    <h2>Latest Announcements</h2>
                    {announcements.map(announcement=>{
                        return <Card key={announcement._id} className="card">
                        <CardMedia
                            component="img"
                            alt={announcement.title}
                            height="140"
                            src={announcement.attachment.content}
                            onClick={()=>handleAnnouncementView(announcement._id)}
                        />
                        <CardContent onClick={()=>handleAnnouncementView(announcement._id)}>
                            <p className="title">
                                {announcement.title}
                            </p>
                            <p className="description">
                                Description: {announcement.description}
                            </p>
                        </CardContent>
                        <CardActions className="action-section">
                                <button onClick={()=>handleAnnouncementView(announcement._id)} className="apply-button">View</button>
                        </CardActions>
                    </Card>
                    })}
                    <button onClick={()=>handleViewMoreOnClick('/announcement/view')} className="button">Browse All Announcements</button>
                </div>
                <div className='row'>
                    <h2>Happening Charity Events</h2>
                    {events.map(event=>{
                        return <Card key={event._id} className="card">
                            <CardMedia
                                component="img"
                                alt={event.title}
                                height="140"
                                src={event.photo.content}
                                onClick={()=>handleEventView(event._id)}
                            />
                            <CardContent onClick={()=>handleEventView(event._id)}>
                                <p className="title">
                                    {event.title}
                                </p>
                                <p className="description">
                                    Purpose: {event.purpose}
                                </p>
                                <p className="description">
                                    Target Amount: RM{event.amount}
                                </p>
                            </CardContent>
                            <CardActions className="action-section">
                                <button onClick={event.status=="In Progress"?()=>handleEventView(event._id):()=>handleClick("apply_help",event._id)} className={event.status=="In Progress"?"donate-button":"preregistration-button"}>{event.status=="In Progress"?"Donate":"Apply For Help"}</button>
                            </CardActions>
                        </Card>
                    })}
                    <button onClick={()=>handleViewMoreOnClick('/charity_event/view')} className="button">Browse All Charity Events</button>
                </div>
                <div className='row'>
                    <h2>Part-Time Job Available</h2>
                    {jobs.map(job=>{
                        return <Card key={job._id} className="card">
                            <CardMedia
                                component="img"
                                alt={job.title}
                                height="140"
                                src={job.photo.content}
                                onClick={()=>handleJobView(job._id)}
                            />
                            <CardContent onClick={()=>handleJobView(job._id)}>
                                <p className="title">
                                    {job.title}
                                </p>
                                <p className="description">
                                    Description: {job.description}
                                </p>
                                <p className="description">
                                    Allowance: RM {job.allowance}
                                </p>
                            </CardContent>
                            <CardActions className="action-section">
                                <button onClick={()=>handleApply(job._id)} className="apply-button">Apply</button>
                            </CardActions>
                        </Card>
                        })}
                        <button onClick={()=>handleViewMoreOnClick('/part_time_job/view')} className="button">Browse All Part-Time Jobs</button>
                </div>
            </div>
            </>}
        </React.Fragment>
    )
}


export default Main;