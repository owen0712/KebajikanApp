import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './application-history.css';
import { ProfileSideNavigation, Status, Loading } from '../../../components';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Swal from 'sweetalert2';

const ApplicationHistoty = (props) =>{
    const navigate = useNavigate();
    const [eventApplications,setEventApplications] = useState([]);
    const [jobApplications,setJobApplications] = useState([]);
    const [jobProposal, setJobProposal] = useState([]);
    const [eventProposal, setEventProposal] = useState([]);
    const [proposal, setProposal] = useState();
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(false);
    const [isDisplayEventApplication,setIsDisplayEventApplication] = useState(true);
    const [isDisplayJobApplication,setIsDisplayJobApplication] = useState(false);
    const [isDisplayProposalApplication,setIsDisplayProposalApplication] = useState(false);

    useEffect(()=>{
        fetchEventApplicationData();
        fetchJobApplicationData();
        fetchEventProposalApplicationData();
        fetchJobProposalApplicationData();
    },[])

    const fetchJobApplicationData=()=>{
        setIsLoading(true);
        const {id}=JSON.parse(sessionStorage.getItem("user"));
        fetch('/job_application/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setJobApplications(data.events);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const fetchEventApplicationData=()=>{
        setIsLoading(true);
        const {id}=JSON.parse(sessionStorage.getItem("user"));
        fetch('/charity_application/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setEventApplications(data.events);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const fetchEventProposalApplicationData=()=>{
        setIsLoading(true);
        const {id}=JSON.parse(sessionStorage.getItem("user"));
        fetch('/charity_event/organizer/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log("Charity",data.events);
                data.events.map(event=>{event.type="Charity Event"});
                const events = data.events;
                setEventProposal(events);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const fetchJobProposalApplicationData=()=>{
        setIsLoading(true);
        const {id}=JSON.parse(sessionStorage.getItem("user"));
        fetch('/part_time_job/organizer/'+id,{
            method:'get',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                console.log("Jobs",data.events);
                data.events.map(event=>{event.type="Part-Time Job"});
                const events = data.events;
                setJobProposal(events);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleViewEventApplication = (id) => {
        navigate('/profile/application_history/event_application/view/'+id);
    }
    
    const handleViewJobApplication = (id) => {
        navigate('/profile/application_history/job_application/view/'+id);
    }
    
    const handleViewProposalApplication = (id) => {
        navigate('/profile/application_history/proposal_application/view/'+id);
    }

    const handleEditEventApplication = (id) => {
        navigate('/profile/application_history/event_application/edit/'+id);
    }

    const handleEditJobApplication = (id) => {
        navigate('/profile/application_history/job_application/edit/'+id);
    }

    const handleEditProposalApplication = (id) => {
        navigate('/profile/application_history/proposal_application/edit/'+id);
    }

    const handleDeleteEventApplication = (id) =>{
        Swal.fire({
            title: 'Withdraw Charity Event Application',
            text: 'Do you want to withdraw this charity event application?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                console.log(id)
                fetch('/charity_application/'+id,{
                    method:'delete',
                    headers:{
                        'Content-Type':'application/json'
                    }
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
                            title: data.message,
                            text: 'Successfully withdraw this application!',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                    }
                    
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
                window.location.reload();
            }
        })
    }

    const handleDeleteJobApplication = (id) =>{
        Swal.fire({
            title: 'Withdraw Job Application',
            text: 'Do you want to withdraw this job application?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                console.log(id)
                fetch('/job_application/'+id,{
                    method:'delete',
                    headers:{
                        'Content-Type':'application/json'
                    }
                }).then(res=>res.json()).then(data=>{
                    if(data.error){
                        Swal.fire({
                            title: data.error,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }
                    else{
                        console.log(data.message);
                        Swal.fire({
                            title: data.message,
                            text: 'Successfully withdraw this application!',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                    }
                    
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
                window.location.reload();
            }
        })
    }

    const handleDeleteProposalApplication =(id)=>{
        console.log("Delete",id);
    }

    const onDisplayEventApplication = ()=> {
        setIsDisplayEventApplication(true);
        setIsDisplayJobApplication(false);
        setIsDisplayProposalApplication(false);
    }

    const onDisplayJobApplication = ()=> {
        setIsDisplayEventApplication(false);
        setIsDisplayJobApplication(true);
        setIsDisplayProposalApplication(false);
    }

    const onDisplayProposalApplication = ()=> {
        setIsDisplayEventApplication(false);
        setIsDisplayJobApplication(false);
        setIsDisplayProposalApplication(true);
        setProposal([...eventProposal,...jobProposal]);
    }

    const renderEventApplication = () =>{
        return(
            <div id="event-application-list-table-section">
                <table>
                    <thead>
                        <tr id="event-application-list-table-header-row">
                            <th>CHARITY EVENT NAME</th>
                            <th>DATE APPLIED</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        eventApplications.map(application=>{
                            return <tr key={application._id}>
                                <td>{application.event_id.title}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewEventApplication(application._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEditEventApplication(application._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDeleteEventApplication(application._id)}><PersonRemoveIcon/>Withdraw</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                </div>
        )
    }

    const renderJobApplication = () =>{
        return(
            <div id="job-application-list-table-section">
                <table>
                    <thead>
                        <tr id="job-application-list-table-header-row">
                            <th>PART-TIME JOB NAME</th>
                            <th>DATE APPLIED</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        jobApplications.map(application=>{
                            return <tr key={application._id}>
                                <td>{application.job_id.title}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewJobApplication(application._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEditJobApplication(application._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDeleteJobApplication(application._id)}><PersonRemoveIcon/>Withdraw</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                </div>
        )
    }

    const renderProposalApplication = () =>{
        console.log("Proposal",proposal);
        return(
            <div id="proposal-application-list-table-section">
                <table>
                    <thead>
                        <tr id="proposal-application-list-table-header-row">
                            <th>PROPOSAL NAME</th>
                            <th>TYPE</th>
                            <th>DATE APPLIED</th>
                            <th>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        proposal.map(application=>{
                            return <tr key={application._id}>
                                <td>{application.title}</td>
                                <td>{application.type}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewProposalApplication(application._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEditProposalApplication(application._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' onClick={()=>handleDeleteProposalApplication(application._id)}><PersonRemoveIcon/>Withdraw</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                </div>
        )
    }
    
    return(
        <React.Fragment>
            {isLoading?<Loading/>:""}
            <div id="application-history">
                <ProfileSideNavigation activeIndex={2}/>
                <div id="application-history-content">
                    <div id="application-history-header">
                        <button onClick={()=>onDisplayEventApplication()} className={isDisplayEventApplication?"application-history-head-button-active":"application-history-head-button"}>Charity Event Application</button>
                        <button onClick={()=>onDisplayJobApplication()} className={isDisplayJobApplication?"application-history-head-button-active":"application-history-head-button"}>Part-Time Job Application</button>
                        <button onClick={()=>onDisplayProposalApplication()} className={isDisplayProposalApplication?"application-history-head-button-active":"application-history-head-button"}>Proposal Application</button>
                    </div>
                    <div id="application-history-table">
                    {isDisplayEventApplication? renderEventApplication(): ""}
                    {isDisplayJobApplication? renderJobApplication(): ""}
                    {isDisplayProposalApplication? renderProposalApplication(): ""}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ApplicationHistoty;