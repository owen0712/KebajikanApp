import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './admin.css';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const Admin = (props) => {

    const navigate = useNavigate();

    const handleClick = (url) => {
        navigate(url);
    }
        
    return (
        <React.Fragment>
            <div id="admin-section">
                <span className="option-card" onClick={()=>handleClick('/manage_announcement/view')}>
                    <NewReleasesIcon/>
                    <p>ANNOUNCEMENT</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/manage_charity_event')}>
                    <NewReleasesIcon/>
                    <p>CHARITY EVENT</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/manage_part_time_job')}>
                    <NewReleasesIcon/>
                    <p>PART-TIME JOB</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <NewReleasesIcon/>
                    <p>USER APPLICATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <NewReleasesIcon/>
                    <p>DONATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <NewReleasesIcon/>
                    <p>NOTIFICATION</p>
                </span>
                <span className="option-card" onClick={()=>handleClick('/')}>
                    <NewReleasesIcon/>
                    <p>USER</p>
                </span>
            </div>
        </React.Fragment>
    )
}


export default Admin;