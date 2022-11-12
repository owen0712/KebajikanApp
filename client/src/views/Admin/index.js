import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './admin.css';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import EventTwoToneIcon from '@mui/icons-material/EventTwoTone';
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';
import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import { useUser } from '../../contexts/UserContext';

const Admin = (props) => {

    const navigate = useNavigate();
    const user = useUser();

    const handleClick = (url) => {
        navigate(url);
    }

    const isAdmin = () => {
        if(user){
            return user.role==2;
        }
    }

    const isCharityEventOrganizer = () => {
        if(user){
            return user.role==2||user.charity_event_organizer;
        }
    }

    const isPartTimeJobOrganizer = () => {
        if(user){
            return user.role==2||user.part_time_job_organizer;
        }
    }

    useEffect(()=>{
        let timer = null;
        if(user==null){
            timer = setTimeout(()=>{
                navigate('/login')
            },5000)
        }
        if(user){
            if(user.role!=2&&!user.charity_event_organizer&&!user.part_time_job_organizer){
                navigate('/');
            }
        }
        return () => {
            clearTimeout(timer);
        }
    },[user])
        
    return (
        <React.Fragment>
            <div id="admin-section">
                {isAdmin()&&<span className="option-card" onClick={()=>handleClick('/manage_announcement')}>
                    <NewReleasesIcon/>
                    <p>ANNOUNCEMENT</p>
                </span>}
                {isCharityEventOrganizer()&&<span className="option-card" onClick={()=>handleClick('/manage_charity_event')}>
                    <EventTwoToneIcon/>
                    <p>CHARITY EVENT</p>
                </span>}
                {isPartTimeJobOrganizer()&&<span className="option-card" onClick={()=>handleClick('/manage_part_time_job')}>
                    <WorkTwoToneIcon/>
                    <p>PART-TIME JOB</p>
                </span>}
                {isAdmin()&&<><span className="option-card" onClick={()=>handleClick('/manage_user_application')}>
                    <FactCheckTwoToneIcon/>
                    <p>USER APPLICATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <PaidTwoToneIcon/>
                    <p>DONATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/manage_notification')}>
                    <NotificationsActiveTwoToneIcon/>
                    <p>NOTIFICATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <GroupTwoToneIcon/>
                    <p>USER</p>
                </span>
                </>}
            </div>
        </React.Fragment>
    )
}


export default Admin;