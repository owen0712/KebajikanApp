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

const Admin = (props) => {

    const navigate = useNavigate();

    const handleClick = (url) => {
        navigate(url);
    }
        
    return (
        <React.Fragment>
            <div id="admin-section">
                <span className="option-card" onClick={()=>handleClick('/manage_announcement')}>
                    <NewReleasesIcon/>
                    <p>ANNOUNCEMENT</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/manage_charity_event')}>
                    <EventTwoToneIcon/>
                    <p>CHARITY EVENT</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/manage_part_time_job')}>
                    <WorkTwoToneIcon/>
                    <p>PART-TIME JOB</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <FactCheckTwoToneIcon/>
                    <p>USER APPLICATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <PaidTwoToneIcon/>
                    <p>DONATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <NotificationsActiveTwoToneIcon/>
                    <p>NOTIFICATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <GroupTwoToneIcon/>
                    <p>USER</p>
                </span>
            </div>
        </React.Fragment>
    )
}


export default Admin;