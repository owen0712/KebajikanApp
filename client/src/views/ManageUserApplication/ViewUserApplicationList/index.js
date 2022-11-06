import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './view_user_application_list.css';
import { BackSection, Status, Loading } from '../../../components';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import VerifiedIcon from '@mui/icons-material/Verified';
import Swal from 'sweetalert2';
import { useUser } from '../../../contexts/UserContext';

const ViewUserApplicationList = (props) =>{
    const navigate = useNavigate();
    const [eventApplications,setEventApplications] = useState([]);
    const [jobApplications,setJobApplications] = useState([]);
    const [jobProposal, setJobProposal] = useState([]);
    const [eventProposal, setEventProposal] = useState([]);
    const [proposal, setProposal] = useState([]);
    const [pageNumber,setPageNumber] = useState(1);
    const [isLoading,setIsLoading] = useState(false);
    const [isDisplayEventApplication,setIsDisplayEventApplication] = useState(true);
    const [isDisplayJobApplication,setIsDisplayJobApplication] = useState(false);
    const [isDisplayProposalApplication,setIsDisplayProposalApplication] = useState(false);
    const user = useUser();

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
    },[])

    const fetchJobApplicationData=()=>{
        setIsLoading(true);
        fetch('/job_application',{
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
                console.log("Job Application",data.events);
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const fetchEventApplicationData=()=>{
        setIsLoading(true);
        fetch('/charity_application',{
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
                console.log("Event Application",data.events);
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
                setIsLoading(false);
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const handleViewEventApplication = (id) => {
        navigate('/manage_user_application/event_application/view/'+id);
    }
    
    const handleViewJobApplication = (id) => {
        navigate('/manage_user_application/job_application/view/'+id);
    }
    
    const handleViewProposalApplication = (id, type) => {
        if(type=="Charity Event")
            navigate('/profile/application_history/propose_charity_event/view/'+id);
        else
            navigate('/profile/application_history/propose_part_time_job/view/'+id);
    }

    const handleVerifyEventApplication = (id) => {
        navigate('/manage_user_application/event_application/verify/'+id);
    }

    const handleVerifyJobApplication = (id) => {
        navigate('/manage_user_application/job_application/verify/'+id);
    }

    const handleEditProposalApplication = (id, type) => {
        if(type=="Charity Event")
            navigate('/profile/application_history/propose_charity_event/edit/'+id);
        else
            navigate('/profile/application_history/propose_part_time_job/edit/'+id);
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

    const navigatePrev = () =>{
        navigate('/admin');
    }

    const renderEventApplication = () =>{
        return(
            <div id="event-application-list-table-section">
                <table>
                    <thead>
                        <tr id="event-application-list-table-header-row">
                            <th className='applicant-name'>FULL NAME</th>
                            <th className='title'>CHARITY EVENT NAME</th>
                            <th className='application-date'>DATE APPLIED</th>
                            <th className='application-status'>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        eventApplications.map(application=>{
                            return <tr key={application._id}>
                                <td className='applicant-name'>{application.created_by.name}</td>
                                <td className='title'>{application.event_id.title}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewEventApplication(application._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleVerifyEventApplication(application._id)}><VerifiedIcon/>Verify</button>
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
                            <th className='applicant-name'>FULL NAME</th>
                            <th className='title'>PART-TIME JOB NAME</th>
                            <th className='application-date'>DATE APPLIED</th>
                            <th className='application-status'>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                        jobApplications.map(application=>{
                            return <tr key={application._id}>
                                <td className='applicant-name'>{application.created_by.name}</td>
                                <td>{application.job_id.title}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewJobApplication(application._id)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleVerifyJobApplication(application._id)}><VerifiedIcon/>Verify</button>
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
                            <th className='applicant-name'>FULL NAME</th>
                            <th className='title'>PROPOSAL NAME</th>
                            <th className='application-type'>TYPE</th>
                            <th className='application-date'>DATE APPLIED</th>
                            <th className='application-status'>STATUS</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                            proposal.sort((a,b)=>{return (new Date(b.created_on) - new Date(a.created_on))})
                            .map(application=>{
                            return <tr key={application._id}>
                                <td className='applicant-name'>{application.organizer_id.name}</td>
                                <td className='title'>{application.title}</td>
                                <td>{application.type}</td>
                                <td>{application.created_on.slice(0,10)}</td>
                                <td><Status statusName={(application.status!=="Rejected"&&application.status!=="Pending")?"Approved":application.status}/></td>
                                <td className='button-list'>
                                    <button className='button' onClick={()=>handleViewProposalApplication(application._id, application.type)}><RemoveRedEyeIcon/>View</button>
                                    <button className='button' onClick={()=>handleEditProposalApplication(application._id, application.type)}><VerifiedIcon/>Verify</button>
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
            {isLoading?<Loading/>:<>
            <BackSection title="User Application" previousIsHome={true} onBackButtonClick={navigatePrev}/>
                <div id="user-application-list">
                    <div id="user-application-list-content">
                        <div id="user-application-list-header">
                        <button onClick={()=>onDisplayEventApplication()} className={isDisplayEventApplication?"user-application-list-head-button-active":"user-application-list-head-button"}>Charity Event Application</button>
                            <button onClick={()=>onDisplayJobApplication()} className={isDisplayJobApplication?"user-application-list-head-button-active":"user-application-list-head-button"}>Part-Time Job Application</button>
                            <button onClick={()=>onDisplayProposalApplication()} className={isDisplayProposalApplication?"user-application-list-head-button-active":"user-application-list-head-button"}>Proposal Application</button>
                        </div>
                        <div id="user-application-list-table">
                        {isDisplayEventApplication? renderEventApplication(): ""}
                        {isDisplayJobApplication? renderJobApplication(): ""}
                        {isDisplayProposalApplication? renderProposalApplication(): ""}
                        </div>
                    </div>
                </div>
            </>}
        </React.Fragment>
    )
}
            

export default ViewUserApplicationList;