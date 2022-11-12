import React, { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Popover from '@mui/material/Popover';
import "./header.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import CircleIcon from '@mui/icons-material/Circle';
import { useUser, useUserUpdate } from "../../contexts/UserContext";
import ChatIcon from '@mui/icons-material/Chat';

const Header = (props) => {

  const [userNotifications,setUserNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = useUser();
  const updateUser = useUserUpdate();

  useEffect(()=>{
    fetchNotification();
  },[user])

  useEffect(()=>{
    fetchNotification();
  },[anchorEl])

  useEffect(()=>{
    if(open){
      updateReadNotification();
    }
  },[anchorEl])

  const isAdministrator = () => {
    if(user){
      return user.role>0||user.charity_event_organizer||user.part_time_job_organizer;
    }
  }

  const fetchNotification = () => {
    if(user==null){
      return;
    }
    fetch('/notification/unread/'+user.id,{
      method:'get',
      headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer'+user.access_token
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
          setUserNotifications(data.userNotifications);
        }
    }).catch(err=>{
        Swal.fire({
            title: err,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    })
  }

  const updateReadNotification = () => {
    if(user==null){
      return;
    }
    fetch('/notification/read/'+user.id,{
      method:'put',
      headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer'+user.access_token
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
          console.log(data.message)
        }
    }).catch(err=>{
        Swal.fire({
            title: err,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    })
  }

  const handleOnClick = () => {
    updateUser(null);
  }

  const handleNotificationOnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  
  return (
  <React.Fragment>
    <div id="header">
      <nav id="">
          <span><Link to='/' className="logo-name white-text">Kebajikan App</Link></span>
          <span><Link to='/announcement/view' className="nav-item white-text">ANNOUNCEMENT</Link></span>
          <span><Link to='/charity_event/view' className="nav-item white-text">CHARITY EVENT</Link></span>
          <span><Link to='/part_time_job/view' className="nav-item white-text">PART-TIME JOB</Link></span>
          <span><Link to='/' className="nav-item white-text">ABOUT US</Link></span>
      </nav>
      {
        user?
        <nav id="user-section">
        <span><Link to='/chat' className="nav-item white-text"><ChatIcon/></Link></span>
        {isAdministrator()?<span><Link to='/admin' className="nav-item white-text">Administration</Link></span>:<></>}
        <span className="nav-item" id="notification-icon"><NotificationsActiveIcon onClick={handleNotificationOnClick}/></span>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleOnClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div className="notification-row"><hr/></div>
          {userNotifications.map((userNotification)=>{
            return <div className={"notification-row "+userNotification.status} key={userNotification._id}>
            <span className="notification-content">
            <h4>{userNotification.notification_id.title}</h4>
            <p>{userNotification.notification_id.description}</p>
            <small>{userNotification.created_on.slice(0,10)}</small>
            </span>
            {userNotification.status=="unread"?<span className="notification-unread-icon"><CircleIcon/></span>:<></>}
            <hr/>
            </div>
          })}
        </Popover>

        <span><Link to='/profile' className="nav-item white-text align-middle"><AccountCircleIcon/>{user.name}</Link></span>
        <span><Link to='/login'  onClick={handleOnClick} className="nav-item white-text">Logout</Link></span>
        </nav>
        :
        <nav id="user-section">
          <span><Link to='/login' className="nav-item white-text align-middle"><AccountCircleIcon/>Sign In</Link></span>
        </nav>
      }
      
    </div>
    </React.Fragment>
  );
}

export default Header;
