import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './application-history.css';
import { ProfileSideNavigation, Status, Loading } from '../../../components';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Pagination from '@mui/material/Pagination';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const ApplicationHistoty = (props) =>{
    const navigate = useNavigate();
    const [eventApplications,setEventApplications] = useState([]);
    const [jobApplications,setJobApplications] = useState([]);
    const [jobProposal, setJobProposal] = useState([]);
    const [eventProposal, setEventProposal] = useState([]);
    const [proposal, setProposal] = useState([]);
    const [displayedEventApplications,setDisplayEventApplications] = useState([]);
    const [eventApplicationsPage,setEventApplicationsPage] = useState(0);
    const [displayedJobApplications,setDisplayJobApplications] = useState([]);
    const [jobApplicationsPage,setJobApplicationsPage] = useState(0);
    const [displayedProposals,setDisplayProposals] = useState([]);
    const [proposalsPage,setProposalsPage] = useState(0);
    const [isLoading,setIsLoading] = useState(false);
    const [isDisplayEventApplication,setIsDisplayEventApplication] = useState(true);
    const [isDisplayJobApplication,setIsDisplayJobApplication] = useState(false);
    const [isDisplayProposalApplication,setIsDisplayProposalApplication] = useState(false);
    const user = useUser();
    const ROW_PER_PAGE = 6;

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            fetchEventApplicationData();
            fetchJobApplicationData();
            fetchEventProposalApplicationData();
            fetchJobProposalApplicationData();
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])

    useEffect(()=>{
        setDisplayedEventApplication();
    },[eventApplicationsPage,eventApplications])

    useEffect(()=>{
        setDisplayedJobApplication();
    },[jobApplicationsPage,jobApplications])

    useEffect(()=>{
        setDisplayedProposal();
    },[proposalsPage,proposal])

    const fetchJobApplicationData=()=>{
        setIsLoading(true);
        const {id}=user;
        fetch('/job_application/'+user.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setJobApplications(data.events);
                setJobApplicationsPage(1);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const fetchEventApplicationData=()=>{
        setIsLoading(true);
        fetch('/charity_application/'+user.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
            }
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                setEventApplications(data.events);
                setEventApplicationsPage(1);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const fetchEventProposalApplicationData=()=>{
        setIsLoading(true);
        fetch('/charity_event/organizer/'+user.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
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
                setProposalsPage(1);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const fetchJobProposalApplicationData=()=>{
        setIsLoading(true);
        fetch('/part_time_job/organizer/'+user.id,{
            method:'get',
            headers:{
                'Content-Type':'application/json',
                'Authorization':"Bearer"+user.access_token
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
                setProposalsPage(1);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    
    const handleEventApplicationsPageOnChange = (event, value) => {
        setEventApplicationsPage(value);
    }

    const handleJobApplicationsPageOnChange = (event, value) => {
        setJobApplicationsPage(value);
    }

    const handleProposalsPageOnChange = (event, value) => {
        setProposalsPage(value);
    }

    const handleViewEventApplication = (id) => {
        navigate('/profile/application_history/event_application/view/'+id);
    }
    
    const handleViewJobApplication = (id) => {
        navigate('/profile/application_history/job_application/view/'+id);
    }
    
    const handleViewProposalApplication = (id, type) => {
        if(type=="Charity Event")
            navigate('/profile/application_history/propose_charity_event/view/'+id);
        else
            navigate('/profile/application_history/propose_part_time_job/view/'+id);
    }

    const handleEditEventApplication = (id) => {
        navigate('/profile/application_history/event_application/edit/'+id);
    }

    const handleEditJobApplication = (id) => {
        navigate('/profile/application_history/job_application/edit/'+id);
    }

    const handleEditProposalApplication = (id, type) => {
        if(type=="Charity Event")
            navigate('/profile/application_history/propose_charity_event/edit/'+id);
        else
            navigate('/profile/application_history/propose_part_time_job/edit/'+id);
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
                        'Content-Type':'application/json',
                        'Authorization':"Bearer"+user.access_token
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
                        fetchEventApplicationData();
                    }
                    
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
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
                        'Content-Type':'application/json',
                        'Authorization':"Bearer"+user.access_token
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
                        fetchJobApplicationData();
                    }
                    
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
            }
        })
    }

    const handleDeleteEventProposalApplication = (id) =>{
        Swal.fire({
            title: 'Delete Proposed Charity Event',
            text: 'Do you want to delete this proposed charity event?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                fetch('/charity_event/'+id,{
                    method:'delete',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':"Bearer"+user.access_token
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
                        Swal.fire({
                            title: data.message,
                            text: 'Successfully withdraw this proposal!',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                        fetchEventProposalApplicationData();
                    }
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                })
            }
        })
    }

    const handleDeleteJobProposalApplication = (id) =>{
        Swal.fire({
            title: 'Delete Proposed Part-Time Job',
            text: 'Do you want to delete this proposed part-time job?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        }).then(result=>{
            if(result.isConfirmed){
                console.log(id)
                fetch('/part_time_job/'+id,{
                    method:'delete',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':"Bearer"+user.access_token
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
                            text: 'Successfully withdraw this proposal!',
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        })
                        fetchJobProposalApplicationData();
                    }
                    
                }).catch(err=>{
                    Swal.fire({
                        title: err,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                })
            }
        })
        
    }

    const handleDeleteProposalApplication =(id, type)=>{
        if(type=="Charity Event")
            handleDeleteEventProposalApplication(id);
        else
            handleDeleteJobProposalApplication(id);
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
    
    const setDisplayedEventApplication = () =>{
        const firstRow = (eventApplicationsPage-1) * ROW_PER_PAGE + 1;
        const lastRow = eventApplicationsPage * ROW_PER_PAGE;
        if(lastRow>=eventApplications.length){
            setDisplayEventApplications(eventApplications.slice(firstRow-1));
        }
        setDisplayEventApplications(eventApplications.slice(firstRow-1,lastRow));
    }

    const setDisplayedJobApplication = () =>{
        const firstRow = (jobApplicationsPage-1) * ROW_PER_PAGE + 1;
        const lastRow = jobApplicationsPage * ROW_PER_PAGE;
        if(lastRow>=jobApplications.length){
            setDisplayJobApplications(jobApplications.slice(firstRow-1));
        }
        setDisplayJobApplications(jobApplications.slice(firstRow-1,lastRow));
    }

    const setDisplayedProposal = () =>{
        const firstRow = (proposalsPage-1) * ROW_PER_PAGE + 1;
        const lastRow = proposalsPage * ROW_PER_PAGE;
        if(lastRow>=proposal.length){
            setDisplayProposals(proposal.slice(firstRow-1));
        }
        setDisplayProposals(proposal.slice(firstRow-1,lastRow));
    }

    const renderEventApplication = () =>{
        return(
            <div id="event-application-list-table-section">
                <table>
                    <thead>
                        <tr id="event-application-list-table-header-row">
                            <th className='title'>CHARITY EVENT NAME</th>
                            <th className='application-date'>DATE APPLIED</th>
                            <th className='application-status'>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            eventApplications.length==0&&<tr className="no-event" rowSpan={6}>
                                <td colSpan={4}>No event application exists.</td>
                            </tr>
                        }
                        {
                        displayedEventApplications.map(application=>{
                            return <tr key={application._id}>
                                <td className='title'>{application.event_id.title}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewEventApplication(application._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' disabled={(application.status!="Pending")} onClick={()=>(application.status!="Pending")?()=>{}:handleEditEventApplication(application._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' disabled={(application.status!="Pending")}  onClick={()=>(application.status!="Pending")?()=>{}:handleDeleteEventApplication(application._id)}><PersonRemoveIcon/>Withdraw</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {eventApplications.length>0&&<div id="application-list-pagination">
                    <Pagination count={eventApplications.length<=ROW_PER_PAGE?1:parseInt(eventApplications.length/ROW_PER_PAGE)+1} page={eventApplicationsPage} onChange={handleEventApplicationsPageOnChange} />
                </div>}
            </div>
        )
    }

    const renderJobApplication = () =>{
        return(
            <div id="job-application-list-table-section">
                <table>
                    <thead>
                        <tr id="job-application-list-table-header-row">
                            <th className='title'>PART-TIME JOB NAME</th>
                            <th className='application-date'>DATE APPLIED</th>
                            <th className='application-status'>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            jobApplications.length==0&&<tr className="no-event" rowSpan={6}>
                                <td colSpan={4}>No job application exists.</td>
                            </tr>
                        }
                        {
                        displayedJobApplications.map(application=>{
                            return <tr key={application._id}>
                                <td>{application.job_id.title}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewJobApplication(application._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' disabled={(application.status!="Pending")} onClick={()=>(application.status!="Pending")?()=>{}:handleEditJobApplication(application._id)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' disabled={(application.status!="Pending")}  onClick={()=>(application.status!="Pending")?()=>{}:handleDeleteJobApplication(application._id)}><PersonRemoveIcon/>Withdraw</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {jobApplications.length>0&&<div id="user-application-list-pagination">
                    <Pagination count={jobApplications.length<=ROW_PER_PAGE?1:parseInt(jobApplications.length/ROW_PER_PAGE)+1} page={jobApplicationsPage} onChange={handleJobApplicationsPageOnChange} />
                </div>}
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
                            <th className='title'>PROPOSAL NAME</th>
                            <th className='application-type'>TYPE</th>
                            <th className='application-date'>DATE APPLIED</th>
                            <th className='application-status'>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            proposal.length==0&&<tr className="no-event" rowSpan={6}>
                                <td colSpan={5}>No proposal exists.</td>
                            </tr>
                        }
                        {
                        displayedProposals.sort((a,b)=>{return (new Date(b.created_on) - new Date(a.created_on))})
                        .map(application=>{
                            return <tr key={application._id}>
                                <td className='title'>{application.title}</td>
                                <td>{application.type}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={(application.status!=="Rejected"&&application.status!=="Pending")?"Approved":application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewProposalApplication(application._id, application.type)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEditProposalApplication(application._id, application.type)}><CreateIcon/>Edit</button>
                                    <button className='danger-button' disabled={(application.status!="Pending")} onClick={(application.status!="Pending")?()=>{}:()=>handleDeleteProposalApplication(application._id, application.type)}><PersonRemoveIcon/>Withdraw</button>    
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {proposal.length>0&&<div id="user-application-list-pagination">
                    <Pagination count={proposal.length<=ROW_PER_PAGE?1:parseInt(proposal.length/ROW_PER_PAGE)+1} page={proposalsPage} onChange={handleProposalsPageOnChange} />
                </div>}
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