import React, { useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./header.css";
import { Link } from "react-router-dom";

const Header = (props) => {

  const [user,setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
  }
  
  return (
  <React.Fragment>
    <div id="header">
      <nav id="">
          <span><Link to='/' className="logo-name white-text">Kebajikan App</Link></span>
          <span><Link to='/announcement/view' className="nav-item white-text">ANNOUNCEMENT</Link></span>
          <span><Link to='/charity_event/view' className="nav-item white-text">CHARITY EVENT</Link></span>
          <span><Link to='/' className="nav-item white-text">PART-TIME JOB</Link></span>
          <span><Link to='/' className="nav-item white-text">ABOUT US</Link></span>
      </nav>
      {
        user?
        <nav id="user-section">
        <span><Link to='/profile' className="nav-item white-text">{user.name}</Link></span>
        <AccountCircleIcon className="nav-item"/>
        <span><Link to='/signin'  onClick={handleLogout} className="nav-item white-text">Logout</Link></span>
      </nav>
        :
        <nav id="user-section">
          <span><Link to='/login' className="nav-item white-text">Sign In</Link></span>
          <AccountCircleIcon className="nav-item"/>
        </nav>
      }
      
    </div>
    </React.Fragment>
  );
}

export default Header;
