import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './ProfileSideNavigation.css';
import PropTypes from "prop-types";

const ProfileSideNavigation = (props) =>{
    return(
        <div id="profile-side-navigation">
            <nav>
                <ul id="first-profile-nav-item"><Link to='/profile/view' className={props.activeIndex===0?"profile-nav-item-active":"profile-nav-item"}>PROFILE</Link></ul>
                <ul><Link to='/' className={props.activeIndex===1?"profile-nav-item-active":"profile-nav-item"}>PASSWORD</Link></ul>
                <ul><Link to='/profile/application_history' className={props.activeIndex===2?"profile-nav-item-active":"profile-nav-item"}>APPLICATION HISTORY</Link></ul>
                <ul><Link to='/' className={props.activeIndex===3?"profile-nav-item-active":"profile-nav-item"}>DONATION HISTORY</Link></ul>
                <ul><Link to='/' className={props.activeIndex===4?"profile-nav-item-active":"profile-nav-item"}>PRIVACY SETTING</Link></ul>
            </nav>
        </div>
    )
    
}
ProfileSideNavigation.propTypes ={
    activeIndex: PropTypes.number
}

ProfileSideNavigation.defaultProps ={
    activeIndex: 0
}

export default ProfileSideNavigation;